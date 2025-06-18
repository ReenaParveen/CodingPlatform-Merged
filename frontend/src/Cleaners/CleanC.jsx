const CleanCode = (code) => {
  const mainStart = code.indexOf("int main()");
  const altMainStart = code.indexOf("void main()");
  const startIndex = mainStart !== -1 ? mainStart : altMainStart;

  if (startIndex === -1) return code;

  let beforeMain = code.slice(0, startIndex);
  let mainBody = code.slice(startIndex);

  mainBody = mainBody.replace(/printf\s*\(([^;]+?)\)\s*;/g, (match) => {
    return `${match}\nfflush(stdout);`;
  });

  if (!/include\s*<stdio\.h>/.test(beforeMain)) {
    beforeMain = `#include <stdio.h>\n${beforeMain}`;
  }

  if (/(for\s*\(|scanf\s*\()/.test(mainBody) && !/\bint\s+(i|j)\b/.test(mainBody)) {
    mainBody = mainBody.replace(/(main\s*\(\s*\)\s*{)/, "$1\nint i, j;");
  }

  const cleanMain = mainBody
    .split("\n")
    .map(line => line.trimEnd())
    .join("\n");

  return `${beforeMain}${cleanMain}`;
};

export default CleanCode;
