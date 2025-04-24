
          const fn = require('./solution');
          const testCases = [{"key":1,"input":"\"A man, a plan, a canal: Panama\"","output":"true"},{"key":2,"input":"\"race a car\"","output":"false"},{"key":3,"input":"\" \" ","output":"true"}];
          const callSnippet = "isPalindrome(s)";
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
              } catch (e) {
              }
            }
          
            let args = [];
            let currentArg = '';
            let inQuotes = false;
            let bracketCount = 0;
          
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
              } else if (char === ',' && !inQuotes && bracketCount === 0) {
                args.push(currentArg.trim());
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
              const argNames = callSnippet.match(/\(([^)]*)\)/)?.[1].split(',').map(s => s.trim()).filter(Boolean);
              
              if (!argNames || argNames.length !== args.length) {
                throw new Error("Argument count mismatch between callSnippet and input");
              }
          
              for (let j = 0; j < argNames.length; j++) {
                global[argNames[j]] = args[j];
              }
          
              const functionName = callSnippet.match(/^\s*(\w+)\s*\(/)?.[1];
              if (!functionName) throw new Error("Cannot extract function name from callSnippet");
              global[functionName] = fn;
              
              const run = new Function('fn', `return ${callSnippet};`);
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
        