import { InjectRepository } from '@nestjs/typeorm';
import {
  Candidate,
  CandidateStatus,
  DoneTests,
} from 'src/entities/candidate.entity';
import { Repository } from 'typeorm';
import { OneChoiceQuestion } from 'src/entities/one-choice-question.entity';
import { MultipleChoiceQuestion } from 'src/entities/multiple-choice-question.entity';
import { SubmitAssessmentCommand } from './submit-assessment.command';
import { QuestionNotFoundError } from '../error/question-not-found.error';
import { CandidateNotFoundError } from '../error/candidate-not-found.error';
import { CandidateStatusInvalidError } from '../error/candidate-status-invalid.error';
import { Test } from 'src/entities/test.entity';
import { TestNotFoundError } from '../error/test-not-found.error';
import { Assessment, AssessmentStatus } from 'src/entities/assessment.entity';
import {
  CodingQuestion,
  TestCase,
} from 'src/entities/coding-question.entity';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { CodingQuestionNotFound } from '../../../test/coding-question/update-coding-question/error/coding-question-not-found.error';

export type NearestFailedTestCase = {
  key: number;
  input: string;
  expected: string;
  actual: string;
};

export type RunCodingQuestion = {
  nearestFailedTestCase: NearestFailedTestCase;
  error: string;
  passed: boolean;
  testCasePassed: number;
  totalTestCase: number;
};
export class SubmitAssessmentCommandHandler {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
    @InjectRepository(Test)
    private testRepository: Repository<Test>,
    @InjectRepository(OneChoiceQuestion)
    private oneChoiceQuestion: Repository<OneChoiceQuestion>,
    @InjectRepository(MultipleChoiceQuestion)
    private multipleChoiceQuestion: Repository<MultipleChoiceQuestion>,
    @InjectRepository(CodingQuestion)
    private codingQuestionRepository: Repository<CodingQuestion>,
  ) {}

  public async execute(id: string, command: SubmitAssessmentCommand) {
    const candidate = await this.candidateRepository.findOne({
      where: {
        id: id,
      },
      relations: ['assessment'],
    });

    if (!candidate) {
      throw new CandidateNotFoundError();
    }

    if (candidate.status !== CandidateStatus.PROCESSING) {
      throw new CandidateStatusInvalidError();
    }

    const { tests } = command;
    const doneTest: DoneTests[] = [];

    for (const test of tests) {
      let totalPoint: number = 0;
      let totalQuestionTime = 0;
      const existTest = await this.testRepository.findOne({
        select: ['id', 'name'],
        where: {
          id: test.id,
        },
      });

      if (!existTest) {
        throw new TestNotFoundError();
      }

      for (const answer of test.questionAnswers) {
        if (answer.type === 'one-choice-question') {
          const question = await this.oneChoiceQuestion.findOne({
            select: ['choices', 'key', 'time'],
            where: { id: answer.id },
          });

          if (!question) {
            throw new QuestionNotFoundError();
          }

          const trueAnswer = question.choices.find(
            (value) => value.key === question.key,
          )?.key;

          if (answer.answer === trueAnswer) {
            totalPoint += 1;
          }

          totalQuestionTime += question.time;
        } else if (answer.type === 'multiple-choice-question') {
          const question = await this.multipleChoiceQuestion.findOne({
            select: ['choices', 'key', 'time'],
            where: { id: answer.id },
          });

          if (!question) {
            throw new QuestionNotFoundError();
          }

          const trueAnswers = question.choices
            .filter((value) => question.key.includes(value.key))
            .map((value) => value.key);

          const userAnswers = answer.answer.split(',').map((ans) => ans.trim());

          let questionPoint = 0;

          for (const userAnswer of userAnswers) {
            if (trueAnswers.includes(userAnswer)) {
              questionPoint += 1;
            } else {
              questionPoint -= 1;
            }
          }

          if (questionPoint > 0) {
            totalPoint += Math.round(questionPoint / question.key.length);
          }
          totalQuestionTime += question.time;
        } else if (answer.type === 'coding-question') {
          const codingQuestion = await this.codingQuestionRepository.findOne({
            where: { id: answer.id },
            select: {
              id: true,
              testCases: true,
              callSnippet: true,
              time: true,
            },
          });

          if (!codingQuestion) {
            throw new CodingQuestionNotFound();
          }

          const result = await this.runCodeInDocker(
            answer.answer,
            codingQuestion.testCases,
            codingQuestion.callSnippet,
          );

          if (result) {
            totalPoint += Math.round(
              result.testCasePassed / result.totalTestCase,
            );
          }
          totalQuestionTime += codingQuestion.time;
        }
      }

      const overall = Math.round(
        (totalPoint / test.questionAnswers.length) * 100,
      );

      doneTest.push({
        id: test.id,
        name: existTest.name,
        overall: overall,
        time: test.time,
        totalTime: totalQuestionTime,
      });
    }

    await this.assessmentRepository.update(candidate.assessment.id, {
      status: AssessmentStatus.ACTIVE,
    });

    await this.candidateRepository.save({
      ...candidate,
      doneTests: doneTest,
      takeDate: new Date(),
      status: CandidateStatus.DONE,
    });
  }

  private async runCodeInDocker(
    code: string,
    testCases: TestCase[],
    callSnippet: string,
  ): Promise<RunCodingQuestion> {
    const sandboxDir = path.join(process.cwd(), 'sandbox');
    await fs.mkdir(sandboxDir, { recursive: true });

    const functionNameMatch = callSnippet.match(/^\s*(\w+)\s*\(/);
    if (!functionNameMatch) {
      throw new Error('Cannot extract function name from callSnippet');
    }
    const functionName = functionNameMatch[1];
    code += `module.exports = ${functionName};`;

    await fs.writeFile(path.join(sandboxDir, 'solution.js'), code);

    const runnerCode = `
          const fn = require('./solution');
          const testCases = ${JSON.stringify(testCases)};
          const callSnippet = ${JSON.stringify(callSnippet)};
          let testCasePassed = 0;
          let nearestFailedTestCase = {};
          let check = false;
          
          function parseSingleArg(input) {
            input = input.trim();
            if ((input.startsWith('[') && input.endsWith(']')) ||
                (input.startsWith('{') && input.endsWith('}')) ||
                (input.startsWith('"') && input.endsWith('"')) ||
                (input.startsWith("'") && input.endsWith("'"))) {
              try {
                return JSON.parse(input.replace(/'/g, '"'));
              } catch {}
            }
            
            if (input === 'null') return null;
            if (input === 'undefined') return undefined;
            if (input === 'true') return true;
            if (input === 'false') return false;

            if (!isNaN(input)) return Number(input);
            return input;
          }
          
          function splitArgs(input) {
            const result = [];
            let current = '';
            let bracket = 0, brace = 0, inQuotes = false, quoteType = '';
            for (let i = 0; i < input.length; i++) {
              const c = input[i];
              if ((c === '"' || c === "'") && !inQuotes) {
                inQuotes = true;
                quoteType = c;
                current += c;
              } else if (inQuotes && c === quoteType) {
                inQuotes = false;
                current += c;
              } else if (inQuotes) {
                current += c;
              } else if (c === '[') {
                bracket++;
                current += c;
              } else if (c === ']') {
                bracket--;
                current += c;
              } else if (c === '{') {
                brace++;
                current += c;
              } else if (c === '}') {
                brace--;
                current += c;
              } else if (c === ' ' && bracket === 0 && brace === 0) {
                if (current.trim()) {
                  result.push(current.trim());
                  current = '';
                }
              } else {
                current += c;
              }
            }
            if (current.trim()) result.push(current.trim());
            return result;
          }
          
          for (let i = 0; i < testCases.length; i++) {
            const { key, input, output } = testCases[i];
            let actual;
            try {

              const argNames = callSnippet.match(/\\(([^)]*)\\)/)?.[1].split(',').map(s => s.trim()).filter(Boolean) || [];
              let args;
              if (argNames.length <= 1) {
                args = [parseSingleArg(input)];
              } else {
                args = splitArgs(input).map(parseSingleArg);
              }
              actual = fn(...args);
          
              if (typeof actual === 'object' && actual !== null) {
                actual = JSON.stringify(actual);
              }
              let expectedOutput = output;
              try {
                if ((output.startsWith('[') && output.endsWith(']')) ||
                    (output.startsWith('{') && output.endsWith('}'))) {
                  expectedOutput = JSON.stringify(JSON.parse(output));
                }
              } catch (e) {}
          
              const passed = actual?.toString() === expectedOutput?.toString();
              if (!passed && !check) {
                check = true;
                nearestFailedTestCase = {
                  key: key,
                  input,
                  expected: expectedOutput,
                  actual: actual?.toString(),
                }
              }
          
              if (passed) {
                testCasePassed++;
              }
            } catch (e) {
              console.log(JSON.stringify({
                nearestFailedTestCase,
                error: e.message,
                passed: false,
                testCasePassed: testCasePassed,
                totalTestCase: testCases.length,
              }, null, 2));
              process.exit(1);
            }
          }
          
          console.log(JSON.stringify({
            nearestFailedTestCase,
            error: "",
            passed: !check,
            testCasePassed: testCasePassed,
            totalTestCase: testCases.length,
          }, null, 2));
          `;
    await fs.writeFile(path.join(sandboxDir, 'runner.js'), runnerCode);

    return new Promise((resolve, reject) => {
      exec(
        `docker exec test-golilla-clone-node-code-runner node runner.js`,
        { cwd: sandboxDir },
        (error, stdout, stderr) => {
          if (error) {
            try {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              const errResult = JSON.parse(stdout);
              return resolve(errResult);
            } catch {
              // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
              return reject(stderr || 'Execution error');
            }
          }
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const result = JSON.parse(stdout);
            return resolve(result);
          } catch {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            return reject('Failed to parse result');
          }
        },
      );
    });
  }
}
