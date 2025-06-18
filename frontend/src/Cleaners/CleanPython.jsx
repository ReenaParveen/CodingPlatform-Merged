const CleanPython = (code) => {
  return code
    .split("\n")
    .filter((line) => !line.trim().startsWith("#"))
    .join("\n")
    .replace(/input\s*\(\s*["'][^"']*["']\s*\)/g, "input()");
};

export default CleanPython;
