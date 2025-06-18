import CleanPython from "../Cleaners/CleanPython.jsx"
import CleanJavaScript from "../Cleaners/CleanJavaScript.jsx";
import CleanC from "../Cleaners/CleanC.jsx";
import CleanCpp from "../Cleaners/CleanCpp.jsx";
import CleanJava from "../Cleaners/CleanJava.jsx";

const CleanCode = (code, language) => {
  const lang = language.toLowerCase();

  if (lang === "python") return CleanPython(code);
  if (lang === "javascript") return CleanJavaScript(code);
  if (lang === "c") return CleanC(code);
  if (lang === "c++" || lang === "cpp") return CleanCpp(code);
  if (lang === "java") return CleanJava(code); // Used for extracting prompts

  return code;
};

export default CleanCode;
