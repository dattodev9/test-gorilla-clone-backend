
          const fn = require('./solution');
          const testCases = [{"key":1,"input":"[1,3] [2]","output":"2"},{"key":2,"input":"[1,2] [3,4]","output":"2.5"}];
          const callSnippet = "findMedianSortedArrays(nums1, nums2)";
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
            
            const potentialJsonPattern = /(\[.*?\]|\{.*?\})/g;
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
              return inputStr.trim().split(/\s+/).map(arg => parseValue(arg));
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
        