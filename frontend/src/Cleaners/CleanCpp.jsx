const CleanCpp  = (code) => {
  if (!code.includes("#include <iostream>")) {
    code = `#include <iostream>\n${code}`;
  }

  code = code.replace(
    /(std::cout\s*<<\s*(".*?")\s*;)/g,
    `$1 std::cout.flush();`
  );

  code = code.replace(/std::cin\s*>>\s*([^;]+);/g, (_, vars) => {
    const inputs = vars.split(">>").map(v => v.trim());
    return inputs.map(v => `std::cin >> ${v};`).join("\n");
  });

  return code;
};

export default CleanCpp;
