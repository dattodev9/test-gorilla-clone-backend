import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CodingQuestion, TestCase } from 'src/entities/coding-question.entity';
import { RunCodingQuestionCommand } from './run-coding-question.command';
import { CodingQuestionNotFound } from '../../update-coding-question/error/coding-question-not-found.error';
import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { SubmitType } from '../controller/run-coding-question-request.dto';

export class RunCodingQuestionCommandHandler {
  constructor(
    @InjectRepository(CodingQuestion)
    private codingQuestionRepository: Repository<CodingQuestion>,
  ) {}

  public async execute(id: string, command: RunCodingQuestionCommand) {
    const codingQuestion = await this.codingQuestionRepository.findOne({
      where: { id },
      select: { testCases: true, callSnippet: true },
    });

    if (!codingQuestion) {
      throw new CodingQuestionNotFound();
    }

    const { code, type } = command;
    const testCases =
      type === SubmitType.RUN
        ? codingQuestion.testCases.slice(0, 3)
        : codingQuestion.testCases;

    const result = await this.runCodeInDocker(
      code,
      testCases,
      codingQuestion.callSnippet,
    );

    return result;
  }

  private async runCodeInDocker(
    code: string,
    testCases: TestCase[],
    callSnippet: string,
  ) {
    const sandboxBaseDir = path.join(process.cwd(), 'sandbox');
    const uniqueId = crypto.randomUUID();
    const sandboxDir = path.join(sandboxBaseDir, uniqueId);
    await fs.mkdir(sandboxDir, { recursive: true });

    try {
      const functionNameMatch = callSnippet.match(/^\s*(\w+)\s*\(/);
      if (!functionNameMatch) {
        throw new Error('Cannot extract function name from callSnippet');
      }
      const functionName = functionNameMatch[1];
      code += `\nmodule.exports = ${functionName};\n`;

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

      return await new Promise((resolve, reject) => {
        exec(
          `docker exec test-golilla-clone-node-code-runner node ${uniqueId}/runner.js`,
          { cwd: sandboxDir },
          (error, stdout, stderr) => {
            if (error) {
              try {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const errResult = JSON.parse(stdout);
                resolve(errResult);
              } catch {
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                reject(stderr || 'Execution error');
              }
            } else {
              try {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const result = JSON.parse(stdout);
                resolve(result);
              } catch {
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                reject('Failed to parse result');
              }
            }
          },
        );
      });
    } finally {
      await fs.rm(sandboxDir, { recursive: true, force: true });
    }
  }
}
