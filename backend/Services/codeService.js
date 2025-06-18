const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const tempDir = path.join(__dirname, '../temp');

const compileAndRunCode = (code, input = '') => {
  return new Promise((resolve, reject) => {
    const className = extractMainClassName(code);
    if (!className) return reject(new Error('No public class found'));

    const filePath = path.join(tempDir, `${className}.java`);
    const inputFilePath = path.join(tempDir, 'input.txt');
    fs.writeFileSync(filePath, code);
    fs.writeFileSync(inputFilePath, input);

    exec(`javac "${filePath}"`, (err) => {
      if (err) {
        fs.unlinkSync(filePath);
        fs.unlinkSync(inputFilePath);
        return reject(new Error(`Compilation Error: ${err.message}`));
      }

      exec(`java -cp "${tempDir}" ${className} < "${inputFilePath}"`, (err, stdout, stderr) => {
        fs.unlinkSync(filePath);
        fs.unlinkSync(inputFilePath);
        if (err) return reject(new Error(`Execution Error: ${stderr}`));

        const promptMatches = [
          ...code.matchAll(/System\.out\.print(?:ln)?\s*\(\s*["'`]([^\"'+\\r\\n]*)["'`]\s*\)/g)
        ];
        const promptLines = promptMatches.map(m => m[1]?.trim()).filter(Boolean);

        const outputLines = stdout.split(/\r?\n/).filter(line => {
          const trimmed = line.trim();
          return (
            trimmed.length > 0 &&
            !promptLines.some((prompt) => trimmed && trimmed.includes(prompt))
          );
        });

        resolve(stdout.trim());
      });
    });
  });
};


const executeJavaScriptCode = (code) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(tempDir, 'script.js');
    fs.writeFileSync(filePath, code);

    exec(`node "${filePath}"`, (err, stdout, stderr) => {
      fs.unlinkSync(filePath); // Clean up the file after execution
      if (err) return reject(new Error(`Execution Error: ${stderr}`));
      resolve(stdout || stderr);
    });
  });
};

const extractMainClassName = (code) => {
  const match = code.match(/public\s+class\s+(\w+)/);
  return match ? match[1] : null;
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

module.exports = {
  compileAndRunCode,
  executeJavaScriptCode,
  compileAndRunPythonCode,
};