
          const fn = require('./solution');
          const testCases = [{"key":1,"input":"1 1","output":"2"},{"key":2,"input":"1 2","output":"3"},{"key":3,"input":"1 3","output":"4"}];
          const callSnippet = "sum(a, b)";
          let testCasePassed = 0;
          let nearestFailedTestCase = {};
          let check = false;

          for (let i = 0; i < testCases.length; i++) {
            const { key, input, output } = testCases[i];
            let actual;
            try {
              const args = input.trim().split(/\s+/).map(Number);
              const argNames = callSnippet.match(/\(([^)]*)\)/)?.[1].split(',').map(s => s.trim());
              
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
        