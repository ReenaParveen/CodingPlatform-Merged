const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const pty = require('node-pty');


const tempDir = path.join(__dirname, '../temp');

// 🧠 Generic interactive handler using node-pty
function runWithPty(cmd, args, inputLines) {
  return new Promise((resolve, reject) => {
    const ptyProcess = pty.spawn(cmd, args, {
      name: 'xterm-color',
      cols: 80,
      rows: 24,
      cwd: process.cwd(),
    });

    let output = '';
    let inputIndex = 0;

    ptyProcess.on('data', (data) => {
      output += data;

      // 🟢 Send next input if we have any left
      if (inputIndex < inputLines.length) {
        ptyProcess.write(inputLines[inputIndex++] + '\r'); // like pressing Enter
      }
    });

    ptyProcess.on('exit', (code) => {
      resolve(output.trimEnd());
    });

    ptyProcess.on('error', (error) => {
      reject(error);
    });
  });
}


// // 🧠 Generic interactive process handler — like LeetCode/Programiz
// function runInteractiveProcess(cmd, args, inputLines) {
//   return new Promise((resolve, reject) => {
//     const child = spawn(cmd, args);
//     let output = '';
//     let inputIndex = 0;

//     child.stdout.on('data', (data) => {
//       const text = data.toString();
//       output += text;

//       // ✅ Feed the next input line immediately if we have one
//       if (inputIndex < inputLines.length) {
//         const nextInput = inputLines[inputIndex++];
//         output += nextInput + '\n';
//         child.stdin.write(nextInput + '\n');
//       }
//     });

//     child.stderr.on('data', (data) => {
//       output += data.toString();
//     });

//     child.on('close', (code) => {
//       resolve(output.trimEnd());
//     });

//     child.on('error', (err) => reject(err));
//   });
// }

// 🐍 Python execution
// const compileAndRunPythonCode = (code, input = '') => {
//   return new Promise((resolve, reject) => {
//     const filePath = path.join(tempDir, 'main.py');
//     fs.writeFileSync(filePath, code);

//     const inputLines = input.split('\n');
//     runInteractiveProcess('python', ['-u', filePath], inputLines)
//       .then((result) => {
//         fs.unlinkSync(filePath);
//         resolve(result);
//       })
//       .catch((error) => {
//         fs.unlinkSync(filePath);
//         reject(error);
//       });
//   });
// };

// 🐍 Python execution
// const compileAndRunPythonCode = (code, input = '') => {
//   return new Promise((resolve, reject) => {
//     console.log("before detecting files");
//     const filePath = path.join(tempDir, 'main.py');
//     console.log("After detecting files",filePath);
//     fs.writeFileSync(filePath, code);
//     console.log("file doesn't exist");
//     const inputLines = input.split('\n');
//     console.log("exceute file");
//     runWithPty('python', ['-u', filePath], inputLines)
//       .then((result) => {
//         console.log("entered success block");
//         fs.unlinkSync(filePath); // clean up
//         resolve(result);         // return full output
//       })
//       .catch((error) => {
//         console.log("entered catch block");
//         // fs.unlinkSync(filePath);
//         reject(error);
//       });
//   });
// };


// const compileAndRunPythonCode = (code, input = '') => {
//   return new Promise((resolve, reject) => {
//     if (!fs.existsSync(tempDir)) {
//       fs.mkdirSync(tempDir, { recursive: true }); // ✅ ensure temp dir
//     }

//     const filePath = path.join(tempDir, 'main.py');
//     console.log("filePath",filePath);
    
//     fs.writeFileSync(filePath, code);

//     const inputLines = input.split('\n');
//     console.log("before python path");
//     // ✅ Choose Python interpreter dynamically
//     let pythonPath;
//     if (process.platform === 'win32') {
//       console.log("windows got exceuted");
//       pythonPath = "C:\\Python312\\python.exe"; // Windows
//     } else {
//       console.log("ubuntu got exceuted");
//       pythonPath = "python3"; // Linux/Ubuntu/MacOS — use python3 from PATH
//     }

//     runWithPty(pythonPath, ['-u', filePath], inputLines)
//       .then((result) => {
//         resolve(result); // ✅ return full output
//       })
//       .catch((error) => {
//         reject(error); // ✅ propagate errors
//       });
//   });
// };


// 🐍 Python execution
const compileAndRunPythonCode = (code, input = '') => {
  return new Promise((resolve, reject) => {
    try {
      console.log('1️⃣ Entering compileAndRunPythonCode');

      // 🟢 Ensure temp directory exists
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
        console.log('2️⃣ Created tempDir:', tempDir);
      }

      const filePath = path.join(tempDir, 'main.py');
      console.log('3️⃣ filePath =', filePath);

      fs.writeFileSync(filePath, code, { encoding: 'utf-8' });
      console.log('4️⃣ Successfully wrote main.py');

      const inputLines = input.split('\n').filter(line => line.trim() !== '');
      console.log('5️⃣ Input lines:', inputLines);

      // ✅ Use absolute path on Windows
      const pythonPath = process.platform === 'win32'
        ? 'C:\\Python312\\python.exe'
        : 'python3';
      console.log('6️⃣ Using pythonPath:', pythonPath);

      // 🟢 Run with pty
      runWithPty(pythonPath, ['-u', filePath], inputLines)
        .then((result) => {
          console.log('7️⃣ runWithPty succeeded');
          // 🧹 Cleanup
          try { fs.unlinkSync(filePath); } catch (e) { console.warn('Cleanup failed:', e); }
          resolve(result);
        })
        .catch((error) => {
          console.error('❌ Error in runWithPty:', error);
          reject(error);
        });

    } catch (e) {
      console.error('❌ Synchronous error before pty:', e);
      reject(e);
    }
  });
};



// ☕ Java execution
const compileAndRunCode = (code, input = '') => {
  return new Promise((resolve, reject) => {
    const classNameMatch = code.match(/public\s+class\s+(\w+)/);
    if (!classNameMatch) return reject(new Error('No public class found'));
    const className = classNameMatch[1];

    const filePath = path.join(tempDir, `${className}.java`);
    fs.writeFileSync(filePath, code);

    exec(`javac "${filePath}"`, (err) => {
      if (err) {
        fs.unlinkSync(filePath);
        return reject(new Error(`Compilation Error: ${err.message}`));
      }

      const inputs = input.split('\n');
      runInteractiveProcess('java', ['-cp', tempDir, className], inputs)
        .then((result) => {
          fs.unlinkSync(filePath);
          const classFile = path.join(tempDir, `${className}.class`);
          if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
          resolve(result);
        })
        .catch((error) => {
          fs.unlinkSync(filePath);
          reject(error);
        });
    });
  });
};

// 🧠 C execution
const compileAndRunCCode = (code, input = '') => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(tempDir, 'main.c');
    const outputPath = path.join(tempDir, 'main.out');
    fs.writeFileSync(filePath, code);

    exec(`gcc "${filePath}" -o "${outputPath}"`, (err) => {
      if (err) {
        fs.unlinkSync(filePath);
        return reject(new Error(`Compilation Error: ${err.message}`));
      }

      const inputs = input.split('\n');
      runInteractiveProcess(outputPath, [], inputs)
        .then((result) => {
          fs.unlinkSync(filePath);
          fs.unlinkSync(outputPath);
          resolve(result);
        })
        .catch((error) => {
          fs.unlinkSync(filePath);
          fs.unlinkSync(outputPath);
          reject(error);
        });
    });
  });
};

// 🧠 C++ execution
const compileAndRunCppCode = (code, input = '') => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(tempDir, 'main.cpp');
    const outputPath = path.join(tempDir, 'main.out');
    fs.writeFileSync(filePath, code);

    exec(`g++ "${filePath}" -o "${outputPath}"`, (err) => {
      if (err) {
        fs.unlinkSync(filePath);
        return reject(new Error(`Compilation Error: ${err.message}`));
      }

      const inputs = input.split('\n');
      runInteractiveProcess(outputPath, [], inputs)
        .then((result) => {
          fs.unlinkSync(filePath);
          fs.unlinkSync(outputPath);
          resolve(result);
        })
        .catch((error) => {
          fs.unlinkSync(filePath);
          fs.unlinkSync(outputPath);
          reject(error);
        });
    });
  });
};

// 🧠 JS execution
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

module.exports = {
  compileAndRunPythonCode,
  compileAndRunCode,
  compileAndRunCCode,
  compileAndRunCppCode,
  executeJavaScriptCode,
};


// const { exec, spawn } = require('child_process');
// const path = require('path');
// const fs = require('fs');

// const tempDir = path.join(__dirname, '../temp');

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

//       const child = spawn('java', ['-cp', tempDir, className]);
//       const inputs = input.split('\n');
//       let inputIndex = 0;
//       let output = '';
//       let error = '';

//       child.stdout.on('data', (data) => {
//         let text = data.toString();

//         if (inputIndex < inputs.length) {
//           const inputLine = inputs[inputIndex];

//           // Handle System.out.print prompts (ends with colon)
//           if (/: ?$/.test(text.trim())) {
//             text = text.replace(/(\s*: ?$)/, `$1${inputLine}\n`);
//             child.stdin.write(inputLine + '\n');
//             inputIndex++;
//           }
//           // Handle println or other outputs that don't end with colon
//           else if (text.trim().length > 0) {
//             child.stdin.write(inputLine + '\n');
//             inputIndex++;
//           }
//         }

//         output += text;
//       });

//       child.stderr.on('data', (data) => {
//         error += data.toString();
//       });

//       child.on('close', (code) => {
//         fs.unlinkSync(filePath);
//         const classFile = path.join(tempDir, `${className}.class`);
//         if (fs.existsSync(classFile)) fs.unlinkSync(classFile);

//         if (code !== 0 || error) {
//           return reject(new Error(`Execution Error: ${error || 'Non-zero exit code'}`));
//         }

//         resolve(output.trim());
//       });
//     });
//   });
// };


// const executeJavaScriptCode = (code) => {
//   return new Promise((resolve, reject) => {
//     const filePath = path.join(tempDir, 'script.js');
//     fs.writeFileSync(filePath, code);

//     exec(`node "${filePath}"`, (err, stdout, stderr) => {
//       fs.unlinkSync(filePath);
//       if (err) return reject(new Error(`Execution Error: ${stderr}`));
//       resolve(stdout || stderr);
//     });
//   });
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

// const extractMainClassName = (code) => {
//   const match = code.match(/public\s+class\s+(\w+)/);
//   return match ? match[1] : null;
// };

// module.exports = {
//   compileAndRunCode,
//   executeJavaScriptCode,
//   compileAndRunPythonCode,
// };