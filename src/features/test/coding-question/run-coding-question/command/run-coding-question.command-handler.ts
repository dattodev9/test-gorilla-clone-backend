import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CodingQuestion,
  TestCase,
} from '../../../../../entities/coding-question.entity';
import { RunCodingQuestionCommand } from './run-coding-question.command';
import { CodingQuestionNotFound } from '../../update-coding-question/error/coding-question-not-found.error';
import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
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

          function tryParseJSON(str) {
            try {
              return JSON.parse(str);
            } catch (e) {
              return str;
            }
          }
          
          function parseValue(value) {
            if (value === 'null') return null;
            if (value === 'undefined') return undefined;
            if (value === 'true') return true;
            if (value === 'false') return false;
            
            const numValue = Number(value);
            if (!isNaN(numValue) && value.trim() === numValue.toString()) {
              return numValue;
            }
            
            const jsonValue = tryParseJSON(value);
            if (jsonValue !== value) {
              return jsonValue;
            }
            
            return value;
          }
          
          function parseInput(inputStr) {
            if ((inputStr.trim().startsWith('[') && inputStr.trim().endsWith(']')) || 
                (inputStr.trim().startsWith('{') && inputStr.trim().endsWith('}'))) {
              try {
                return JSON.parse(inputStr.replace(/'/g, '"'));
              } catch (e) {
              }
            }
            
            const potentialJsonPattern = /(\\[.*?\\]|\\{.*?\\})/g;
            const jsonMatches = inputStr.match(potentialJsonPattern);
            
            if (jsonMatches && jsonMatches.length > 1) {
              return jsonMatches.map(match => {
                try {
                  return JSON.parse(match.replace(/'/g, '"'));
                } catch (e) {
                  return match;
                }
              });
            }
            
            if (!inputStr.includes('"') && !inputStr.includes("'") && 
                !inputStr.includes('[') && !inputStr.includes('{')) {
              return inputStr.trim().split(/\\s+/).map(arg => parseValue(arg));
            }
            
            let args = [];
            let currentArg = '';
            let inQuotes = false;
            let bracketCount = 0;
            let separator = ',';
            
            if (inputStr.includes('"') || inputStr.includes("'") || 
                inputStr.includes('[') || inputStr.includes('{')) {
              let hasSpacesOutside = false;
              let tempInQuotes = false;
              let tempBracketCount = 0;
              
              for (let i = 0; i < inputStr.length; i++) {
                const char = inputStr[i];
                if (char === '"' || char === "'") tempInQuotes = !tempInQuotes;
                else if (char === '[' || char === '{') tempBracketCount++;
                else if (char === ']' || char === '}') tempBracketCount--;
                else if (char === ' ' && !tempInQuotes && tempBracketCount === 0) {
                  hasSpacesOutside = true;
                  break;
                }
              }
              
              separator = hasSpacesOutside ? ' ' : ',';
            } else {
              separator = ' ';
            }
            
            for (let i = 0; i < inputStr.length; i++) {
              const char = inputStr[i];
              
              if (char === '"' || char === "'") {
                inQuotes = !inQuotes;
                currentArg += char;
              } else if (char === '[' || char === '{') {
                bracketCount++;
                currentArg += char;
              } else if (char === ']' || char === '}') {
                bracketCount--;
                currentArg += char;
              } else if (char === separator && !inQuotes && bracketCount === 0) {
                if (currentArg.trim()) {
                  args.push(currentArg.trim());
                }
                currentArg = '';
              } else {
                currentArg += char;
              }
            }
            
            if (currentArg.trim()) {
              args.push(currentArg.trim());
            }
          
            return args.map(arg => parseValue(arg));
          }

          for (let i = 0; i < testCases.length; i++) {
            const { key, input, output } = testCases[i];
            let actual;
            try {
              const args = parseInput(input);
              const argNames = callSnippet.match(/\\(([^)]*)\\)/)?.[1].split(',').map(s => s.trim()).filter(Boolean);
              
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
          
              if (typeof actual === 'object' && actual !== null) {
                actual = JSON.stringify(actual);
              }
          
              let expectedOutput = output;
              try {
                if ((output.startsWith('[') && output.endsWith(']')) || 
                    (output.startsWith('{') && output.endsWith('}'))) {
                  expectedOutput = JSON.stringify(JSON.parse(output));
                }
              } catch (e) {
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
          
            const passed = actual?.toString() === output?.toString();
            if (!passed && !check) {
              check = true;
              nearestFailedTestCase = {
                key: key,
                input,
                expected: output,
                actual: actual?.toString(),
              }
            }
          
            if(passed){
              testCasePassed++;
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
