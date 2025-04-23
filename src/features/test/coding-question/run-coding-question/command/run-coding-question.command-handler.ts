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

    await fs.writeFile(path.join(sandboxDir, 'solution.js'), code);

    const runnerCode = `
          const fn = require('./solution');
          const testCases = ${JSON.stringify(testCases)};
          const callSnippet = ${JSON.stringify(callSnippet)};
          let testCasePassed = 0;
          let nearestFailedTestCase = {};
          let check = false;

          // Helper function to safely parse JSON
          function safeJSONParse(str) {
            try {
              return JSON.parse(str);
            } catch (e) {
              return str;
            }
          }

          // Helper function to parse value with appropriate type
          function parseValue(val) {
            if (val === 'null') return null;
            if (val === 'undefined') return undefined;
            if (val === 'true') return true;
            if (val === 'false') return false;
            
            // Try to parse as a number
            const num = Number(val);
            if (!isNaN(num) && val.trim() !== '') return num;
            
            // Try to parse as JSON (for arrays, objects)
            try {
              // Check if it looks like JSON
              if ((val.startsWith('[') && val.endsWith(']')) || 
                  (val.startsWith('{') && val.endsWith('}'))) {
                return JSON.parse(val);
              }
            } catch (e) {
              // Not valid JSON
            }
            
            // Return as string by default
            return val;
          }

          // Deep equality comparison
          function deepEqual(a, b) {
            // Handle simple cases
            if (a === b) return true;
            
            // Handle null/undefined
            if (a == null && b == null) return true;
            if (a == null || b == null) return false;
            
            // Compare arrays
            if (Array.isArray(a) && Array.isArray(b)) {
              if (a.length !== b.length) return false;
              for (let i = 0; i < a.length; i++) {
                if (!deepEqual(a[i], b[i])) return false;
              }
              return true;
            }
            
            // Compare objects
            if (typeof a === 'object' && typeof b === 'object') {
              const keysA = Object.keys(a);
              const keysB = Object.keys(b);
              
              if (keysA.length !== keysB.length) return false;
              
              for (const key of keysA) {
                if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
              }
              
              return true;
            }
            
            // Convert to string for basic types
            return String(a) === String(b);
          }

          // Function to intelligently parse input based on function parameters
          function parseInput(input, callSnippet) {
            // Extract function name and parameters
            const functionMatch = callSnippet.match(/^\\s*(\\w+)\\s*\\(/);
            if (!functionMatch) return [input]; // Default to whole input if no function pattern found
            
            const functionName = functionMatch[1];
            const paramsMatch = callSnippet.match(/\\(([^)]*)\\)/);
            const paramNames = paramsMatch ? paramsMatch[1].split(',').map(p => p.trim()).filter(p => p) : [];
            
            // Special cases for common function patterns
            if (paramNames.length === 1) {
              // For single parameter functions, try to intelligently determine type
              const paramName = paramNames[0];
              
              // Check if it's a string parameter based on name
              const isStringParam = /^(s|str|string|text|name|word|sentence|char|character|input)$/i.test(paramName);
              
              if (isStringParam) {
                // For string parameter, use whole input as a single string
                return [input];
              }
              
              // If input looks like an array or object
              if ((input.trim().startsWith('[') && input.trim().endsWith(']')) || 
                  (input.trim().startsWith('{') && input.trim().endsWith('}'))) {
                return [parseValue(input.trim())];
              }
            }
            
            // Default case - split by spaces and parse each part
            // But first check for JSON-like structures to preserve them
            const parts = [];
            let currentPart = '';
            let inBrackets = 0;
            let inBraces = 0;
            let inQuotes = false;
            
            for (let i = 0; i < input.length; i++) {
              const char = input[i];
              
              if (char === '[') inBrackets++;
              else if (char === ']') inBrackets--;
              else if (char === '{') inBraces++;
              else if (char === '}') inBraces--;
              else if (char === '"' && input[i-1] !== '\\') inQuotes = !inQuotes;
              
              if (char === ' ' && !inBrackets && !inBraces && !inQuotes) {
                if (currentPart) parts.push(currentPart);
                currentPart = '';
              } else {
                currentPart += char;
              }
            }
            
            if (currentPart) parts.push(currentPart);
            
            // Parse each part with appropriate type
            return parts.map(parseValue);
          }

          // Function to parse expected output
          function parseExpectedOutput(output) {
            return parseValue(output);
          }

          for (let i = 0; i < testCases.length; i++) {
            const { key, input, output } = testCases[i];
            let actual;
            try {
              // Parse input intelligently
              const args = parseInput(input, callSnippet);
              
              // Extract function name and parameter names
              const functionName = callSnippet.match(/^\\s*(\\w+)\\s*\\(/)?.[1];
              const paramsMatch = callSnippet.match(/\\(([^)]*)\\)/);
              const paramNames = paramsMatch ? paramsMatch[1].split(',').map(p => p.trim()).filter(p => p) : [];
              
              // Check special case for whole input
              if (callSnippet.includes('input')) {
                // Use full input string for functions that operate on the whole input
                global.input = input;
              } else if (paramNames.length === args.length) {
                // Assign arguments to parameter names
                for (let j = 0; j < paramNames.length; j++) {
                  global[paramNames[j]] = args[j];
                }
              } else if (callSnippet.includes('new') && args.length === 0) {
                // Special case for constructor with no args
                // Do nothing, just instantiate the class
              } else if (args.length === 0 && paramNames.length === 0) {
                // No args, no params case
              } else if (args.length !== paramNames.length) {
                // Try to make a best effort if params don't match
                if (paramNames.length === 1 && args.length > 1) {
                  // If one param expects many args, join them
                  global[paramNames[0]] = args;
                } else {
                  throw new Error(\`Parameter count mismatch: expected \${paramNames.length}, got \${args.length} args\`);
                }
              }
              
              if (functionName) {
                // Assign the function to global
                global[functionName] = fn;
              } else {
                // If no function name found, make the module available as 'fn'
                global.fn = fn;
              }
              
              try {
                // Execute the code snippet
                const run = new Function('fn', \`return \${callSnippet};\`);
                actual = run(fn);
              } catch (e) {
                // Try alternative method using the function directly
                actual = fn(...args);
              }
                
              // Parse expected output with appropriate type
              const expectedOutput = parseExpectedOutput(output);

              // Compare actual with expected
              const passed = deepEqual(actual, expectedOutput);
              
              if (!passed && !check) {
                check = true;
                nearestFailedTestCase = {
                  key: key,
                  input: input,
                  expected: output,
                  actual: typeof actual === 'object' ? JSON.stringify(actual) : String(actual),
                };
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
                stack: e.stack
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
