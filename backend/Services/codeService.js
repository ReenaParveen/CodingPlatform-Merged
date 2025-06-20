// const { exec } = require('child_process');
// const path = require('path');
// const fs = require('fs');

// const tempDir = path.join(__dirname, '../temp');

// // const compileAndRunCode = (code, input = '') => {
// //   return new Promise((resolve, reject) => {
// //     const className = extractMainClassName(code);
// //     if (!className) return reject(new Error('No public class found'));

// //     const filePath = path.join(tempDir, `${className}.java`);
// //     const inputFilePath = path.join(tempDir, 'input.txt');

// //     fs.writeFileSync(filePath, code);
// //     fs.writeFileSync(inputFilePath, input);

// //     exec(`javac "${filePath}"`, (err) => {
// //       if (err) {
// //         fs.unlinkSync(filePath);
// //         fs.unlinkSync(inputFilePath);
// //         return reject(new Error(`Compilation Error: ${err.message}`));
// //       }

// //       exec(`java -cp "${tempDir}" ${className} < "${inputFilePath}"`, (err, stdout, stderr) => {
// //         fs.unlinkSync(filePath);
// //         fs.unlinkSync(inputFilePath);
// //         if (err) return reject(new Error(`Execution Error: ${stderr}`));

// //         // Only match prompts that look like sentences (not stars or symbols)
// //         const promptRegex = /System\.out\.print(?:ln)?\s*\(\s*["'`]([A-Za-z0-9\s:,.!?]+)["'`]\s*\)/g;
// //         const promptMatches = [];
// //         let match;
// //         while ((match = promptRegex.exec(code)) !== null) {
// //           promptMatches.push(match[1]);
// //         }

// //         // Clean the output without affecting alignment
// //         let cleanedOutput = stdout;
// //         for (const prompt of promptMatches) {
// //           const safePrompt = prompt.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
// //           cleanedOutput = cleanedOutput.replace(new RegExp(safePrompt, 'g'), '');
// //         }

// //         resolve(cleanedOutput.trim());
// //       });
// //     });
// //   });
// // };

// // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// const compileAndRunCode = (code, input = '') => {
//   return new Promise((resolve, reject) => {
//     const className = extractMainClassName(code);
//     if (!className) return reject(new Error('No public class found'));

//     const filePath = path.join(tempDir, `${className}.java`);
//     fs.writeFileSync(filePath, code);

//     exec(`javac "${filePath}"`, (err) => {
//       if (err) {
//         fs.unlinkSync(filePath);
//         return reject(new Error(`Compilation Error: ${err.message}`));
//       }

//       const runProcess = exec(`java -cp "${tempDir}" ${className}`, (err, stdout, stderr) => {
//         fs.unlinkSync(filePath);
//         const classFile = path.join(tempDir, `${className}.class`);
//         if (fs.existsSync(classFile)) fs.unlinkSync(classFile);

//         if (err) return reject(new Error(`Execution Error: ${stderr || err.message}`));

//         // 🟢 Remove prompt lines, return only the result
//         const lines = stdout.trim().split('\n');
//         const filtered = lines.filter(line =>
//           !/enter first number:/i.test(line) &&
//           !/enter second number:/i.test(line)
//         );

//         resolve(filtered.join('\n').trim());
//       });

//       runProcess.stdin.write(input + '\n');
//       runProcess.stdin.end();
//     });
//   });
// };


// // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// // const compileAndRunCode = (code, input = '') => {
// //   return new Promise((resolve, reject) => {
// //     const className = extractMainClassName(code);
// //     if (!className) return reject(new Error('No public class found'));

// //     const filePath = path.join(tempDir, `${className}.java`);
// //     const inputFilePath = path.join(tempDir, 'input.txt');

// //     fs.writeFileSync(filePath, code);
// //     fs.writeFileSync(inputFilePath, input);

// //     exec(`javac "${filePath}"`, (err) => {
// //       if (err) {
// //         fs.unlinkSync(filePath);
// //         fs.unlinkSync(inputFilePath);
// //         return reject(new Error(`Compilation Error: ${err.message}`));
// //       }

// //       exec(`java -cp "${tempDir}" ${className} < "${inputFilePath}"`, (err, stdout, stderr) => {
// //         fs.unlinkSync(filePath);
// //         fs.unlinkSync(inputFilePath);

// //         if (err) return reject(new Error(`Execution Error: ${stderr}`));

// //         // ✅ Remove lines that look like prompts (contain a colon + text before it)
// //         const cleanedOutput = stdout
// //           .split('\n')
// //           .filter(line => !/^[ \t]*[A-Za-z].*:\s*\d*$/.test(line.trim()))
// //           .join('\n')
// //           .replace(/\s+$/, '');

// //         resolve(cleanedOutput);
// //       });
// //     });
// //   });
// // };

// const executeJavaScriptCode = (code) => {
//   return new Promise((resolve, reject) => {
//     const filePath = path.join(tempDir, 'script.js');
//     fs.writeFileSync(filePath, code);

//     exec(`node "${filePath}"`, (err, stdout, stderr) => {
//       fs.unlinkSync(filePath); // Clean up the file after execution
//       if (err) return reject(new Error(`Execution Error: ${stderr}`));
//       resolve(stdout || stderr);
//     });
//   });
// };

// const extractMainClassName = (code) => {
//   const match = code.match(/public\s+class\s+(\w+)/);
//   return match ? match[1] : null;
// };

// const compileAndRunPythonCode = (code, input = '') => {
//   return new Promise((resolve, reject) => {
//     const filePath = path.join(tempDir, 'main.py');
//     const inputFilePath = path.join(tempDir, 'input.txt');
//     fs.writeFileSync(filePath, code);
//     fs.writeFileSync(inputFilePath, input);

//     exec(`python "${filePath}" < "${inputFilePath}"`, (err, stdout, stderr) => {
//       fs.unlinkSync(filePath);
//       fs.unlinkSync(inputFilePath);
//       if (err) return reject(new Error(`Execution Error: ${stderr}`));
//       resolve(stdout || stderr);
//     });
//   });
// };

// module.exports = {
//   compileAndRunCode,
//   executeJavaScriptCode,
//   compileAndRunPythonCode,
// };


const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tempDir = path.join(__dirname, '../temp');

const compileAndRunCode = (code, input = '') => {
  return new Promise((resolve, reject) => {
    const className = extractMainClassName(code);
    if (!className) return reject(new Error('No public class found'));

    const filePath = path.join(tempDir, `${className}.java`);
    fs.writeFileSync(filePath, code);

    exec(`javac "${filePath}"`, (err) => {
      if (err) {
        fs.unlinkSync(filePath);
        return reject(new Error(`Compilation Error: ${err.message}`));
      }

      const child = spawn('java', ['-cp', tempDir, className]);
      const inputs = input.split('\n');
      let inputIndex = 0;
      let output = '';
      let error = '';

      child.stdout.on('data', (data) => {
        let text = data.toString();

        if (inputIndex < inputs.length) {
          const inputLine = inputs[inputIndex];

          // Handle System.out.print prompts (ends with colon)
          if (/: ?$/.test(text.trim())) {
            text = text.replace(/(\s*: ?$)/, `$1${inputLine}\n`);
            child.stdin.write(inputLine + '\n');
            inputIndex++;
          }
          // Handle println or other outputs that don't end with colon
          else if (text.trim().length > 0) {
            child.stdin.write(inputLine + '\n');
            inputIndex++;
          }
        }

        output += text;
      });

      child.stderr.on('data', (data) => {
        error += data.toString();
      });

      child.on('close', (code) => {
        fs.unlinkSync(filePath);
        const classFile = path.join(tempDir, `${className}.class`);
        if (fs.existsSync(classFile)) fs.unlinkSync(classFile);

        if (code !== 0 || error) {
          return reject(new Error(`Execution Error: ${error || 'Non-zero exit code'}`));
        }

        resolve(output.trim());
      });
    });
  });
};


const executeJavaScriptCode = (code) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(tempDir, 'script.js');
    fs.writeFileSync(filePath, code);

    exec(`node "${filePath}"`, (err, stdout, stderr) => {
      fs.unlinkSync(filePath);
      if (err) return reject(new Error(`Execution Error: ${stderr}`));
      resolve(stdout || stderr);
    });
  });
};

const compileAndRunPythonCode = (code, input = '') => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(tempDir, 'main.py');
    const inputFilePath = path.join(tempDir, 'input.txt');
    fs.writeFileSync(filePath, code);
    fs.writeFileSync(inputFilePath, input);

    exec(`python "${filePath}" < "${inputFilePath}"`, (err, stdout, stderr) => {
      fs.unlinkSync(filePath);
      fs.unlinkSync(inputFilePath);
      if (err) return reject(new Error(`Execution Error: ${stderr}`));
      resolve(stdout || stderr);
    });
  });
};

const extractMainClassName = (code) => {
  const match = code.match(/public\s+class\s+(\w+)/);
  return match ? match[1] : null;
};

module.exports = {
  compileAndRunCode,
  executeJavaScriptCode,
  compileAndRunPythonCode,
};
