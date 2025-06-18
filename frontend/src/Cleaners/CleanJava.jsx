const CleanJava = (code) => {
  const promptRegex = /System\.out\.print(ln)?\s*\(\s*"([^"]*(Enter|Input)[^"]*)"\s*\)/g;
  const prompts = [];
  let match;
  while ((match = promptRegex.exec(code)) !== null) {
    prompts.push(match[2]);
  }
  return prompts;
};

export default CleanJava;
