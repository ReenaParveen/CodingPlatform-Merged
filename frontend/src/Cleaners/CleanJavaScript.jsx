const CleanJavaScript = (code) => {
  let inputCounter = 0;

  const fsHeader = `const fs = require("fs");
let inputs = fs.readFileSync(0).toString().trim().split(/\\s+/);`;

  code = code.replace(
    /(?:(let|const|var)\s+)?(\w+)\s*=\s*(parseInt|parseFloat|Number)?\s*\(\s*prompt\s*\(\s*(['"`])(.*?)\4\s*\)\s*\)/g,
    (_, decl = "let", varName, func, __, promptText) => {
      const parseFunc = func ? `${func}(` : "";
      const closeParen = func ? ")" : "";
      return `console.log(\`${promptText}\`);\n${decl} ${varName} = ${parseFunc}inputs[${inputCounter++}]${closeParen};`;
    }
  );

  code = code.replace(
    /(?:(let|const|var)\s+)?(\w+)\s*=\s*prompt\s*\(\s*(['"`])(.*?)\3\s*\)/g,
    (_, decl = "let", varName, __, promptText) => {
      return `console.log(\`${promptText}\`);\n${decl} ${varName} = inputs[${inputCounter++}];`;
    }
  );

  code = code.replace(
    /(\w+\[.*?\])\s*=\s*(parseInt|parseFloat|Number)?\s*\(\s*prompt\s*\(\s*(['"`])(.*?)\3\s*\)\s*\)/g,
    (_, accessor, func, __, promptText) => {
      const parseFunc = func ? `${func}(` : "";
      const closeParen = func ? ")" : "";
      return `console.log(\`${promptText}\`);\n${accessor} = ${parseFunc}inputs[${inputCounter++}]${closeParen};`;
    }
  );

  code = code.replace(/alert\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, (_, inner) => {
    return `console.log(${inner.trim()});`;
  });

  if (!/require\s*\(\s*['"`]fs['"`]\s*\)/.test(code)) {
    code = `${fsHeader}\n\n${code}`;
  }

  return code;
};

export default CleanJavaScript;
