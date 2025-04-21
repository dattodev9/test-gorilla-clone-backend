import { InjectRepository } from '@nestjs/typeorm';
import {
  Candidate,
  CandidateStatus,
  DoneTests,
} from '../../../../entities/candidate.entity';
import { Repository } from 'typeorm';
import { OneChoiceQuestion } from '../../../../entities/one-choice-question.entity';
import { MultipleChoiceQuestion } from '../../../../entities/multiple-choice-question.entity';
import { SubmitAssessmentCommand } from './submit-assessment.command';
import { QuestionNotFoundError } from '../error/question-not-found.error';
import { CandidateNotFoundError } from '../error/candidate-not-found.error';
import { CandidateStatusInvalidError } from '../error/candidate-status-invalid.error';
import { Test } from '../../../../entities/test.entity';
import { TestNotFoundError } from '../error/test-not-found.error';
import { Assessment, AssessmentStatus } from 'src/entities/assessment.entity';
import {
  CodingQuestion,
  TestCase,
} from '../../../../entities/coding-question.entity';
import path from 'path';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { CodingQuestionNotFound } from '../../../test/coding-question/update-coding-question/error/coding-question-not-found.error';

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

    if (candidate.status !== CandidateStatus.ACTIVE) {
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
            select: { testCases: true, callSnippet: true },
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
            totalPoint += 1;
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

    return await this.candidateRepository.save({
      ...candidate,
      doneTests: doneTest.reverse(),
      status: CandidateStatus.DONE,
    });
  }

  private async runCodeInDocker(
    code: string,
    testCases: TestCase[],
    callSnippet: string,
  ): Promise<boolean> {
    const sandboxDir = path.join(process.cwd(), 'sandbox');
    await fs.mkdir(sandboxDir, { recursive: true });

    await fs.writeFile(path.join(sandboxDir, 'solution.js'), code);

    const runnerCode = `
          const fn = require('./solution');
          const testCases = ${JSON.stringify(testCases)};
          const callSnippet = ${JSON.stringify(callSnippet)};
        
          for (let i = 0; i < testCases.length; i++) {
            const { input, output } = testCases[i];
            let actual;
            try {
              const args = input.trim().split(/\\s+/).map(Number);
              const argNames = callSnippet.match(/\\(([^)]*)\\)/)?.[1].split(',').map(s => s.trim());
              
              if (!argNames || argNames.length !== args.length) {
                throw new Error("Argument count mismatch between callSnippet and input");
              }
        
              for (let j = 0; j < argNames.length; j++) {
                global[argNames[j]] = args[j];
              }
        
              const functionName = callSnippet.match(/^\\s*(\\w+)\\s*\\(/)?.[1];
              if (!functionName) throw new Error("Cannot extract function name from callSnippet");
              global[functionName] = fn;
              
              const run = new Function('fn', \`return \${callSnippet};\`);
              actual = run(fn);
            } catch (e) {
              console.log(JSON.stringify(false));
              process.exit(1);
            }
        
            const passed = actual?.toString() === output?.toString();
            if (!passed) {
              console.log(JSON.stringify(false));
              process.exit(1);
            }
          }
        
          console.log(JSON.stringify(true));
        `;

    await fs.writeFile(path.join(sandboxDir, 'runner.js'), runnerCode);

    return new Promise((resolve, reject) => {
      exec(
        `docker exec test-golilla-clone-node-code-runner node runner.js`,
        { cwd: sandboxDir },
        (error, stdout) => {
          const output = stdout.trim().split('\n').pop();
          try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const result = JSON.parse(output);
            resolve(result);
          } catch (err) {
            console.error(err);
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            reject('Failed to parse result: ' + output);
          }
        },
      );
    });
  }
}
