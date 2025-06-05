import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import "./Ui.css";

const Ui = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [language, setLanguage] = useState("Python");
  const [promptInputs, setPromptInputs] = useState([]);
  const [promptList, setPromptList] = useState([]);
  const [currentPromptCount, setCurrentPromptCount] = useState(0);
  const [promptIndex, setPromptIndex] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState("");

  const inputRef = useRef(null);
  // const navigate = useNavigate();

  const inputRegex = /input\s*\(\s*['"`](.*?)['"`]\s*\)|prompt\s*\(\s*['"`](.*?)['"`]\s*\)|printf\s*\(\s*["'`](.*?)["'`]\s*\)/g;

  useEffect(() => {
    const fetchProgramsByLanguage = async () => {
      try {
        const response = await axios.get("http://localhost:5000/programs");
        const filtered = response.data.filter((program) =>
          program.codes.some(
            (code) => code.language?.toLowerCase() === language.toLowerCase()
          )
        );

        setPrograms(filtered);
        if (filtered.length > 0) {
          const selected = filtered[0];
          const selectedCode = selected.codes.find(
            (code) => code.language?.toLowerCase() === language.toLowerCase()
          );
          setSelectedProgram(selected);
          setCode(selectedCode?.solution || "");
        } else {
          setSelectedProgram(null);
          setCode("");
        }
      } catch (error) {
        console.error("Failed to fetch programs:", error);
      }
    };

    if (language) {
      fetchProgramsByLanguage();
    }
  }, [language]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

const cleanCode = (code) => {
  const lang = language.toLowerCase();

  if (lang === "python") {
    return code
      .split("\n")
      .filter((line) => !line.trim().startsWith("#"))
      .join("\n")
      .replace(/input\s*\(\s*["'][^"']*["']\s*\)/g, "input()");
  }

if (lang === "javascript") {
  let inputCounter = 0;

  const fsHeader = `const fs = require("fs");
let inputs = fs.readFileSync(0).toString().trim().split(/\\s+/);`;

  // Handle declarations: let x = parseInt(prompt("text"));
  code = code.replace(
    /(?:(let|const|var)\s+)?(\w+)\s*=\s*(parseInt|parseFloat|Number)?\s*\(\s*prompt\s*\(\s*(['"`])(.*?)\4\s*\)\s*\)/g,
    (_, decl = "let", varName, func, __, promptText) => {
      const parseFunc = func ? `${func}(` : "";
      const closeParen = func ? ")" : "";
      return `console.log(\`${promptText}\`);\n${decl} ${varName} = ${parseFunc}inputs[${inputCounter++}]${closeParen};`;
    }
  );

  // Handle declarations: let x = prompt("text");
  code = code.replace(
    /(?:(let|const|var)\s+)?(\w+)\s*=\s*prompt\s*\(\s*(['"`])(.*?)\3\s*\)/g,
    (_, decl = "let", varName, __, promptText) => {
      return `console.log(\`${promptText}\`);\n${decl} ${varName} = inputs[${inputCounter++}];`;
    }
  );

  // Handle non-declarations inside loops: a[i][j] = parseInt(prompt("text"));
  code = code.replace(
    /(\w+\[.*?\])\s*=\s*(parseInt|parseFloat|Number)?\s*\(\s*prompt\s*\(\s*(['"`])(.*?)\3\s*\)\s*\)/g,
    (_, accessor, func, __, promptText) => {
      const parseFunc = func ? `${func}(` : "";
      const closeParen = func ? ")" : "";
      return `console.log(\`${promptText}\`);\n${accessor} = ${parseFunc}inputs[${inputCounter++}]${closeParen};`;
    }
  );

  // Replace alert() with console.log()
  code = code.replace(/alert\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, (_, inner) => {
    return `console.log(${inner.trim()});`;
  });

  // Add fs header if not already present
  if (!/require\s*\(\s*['"`]fs['"`]\s*\)/.test(code)) {
    code = `${fsHeader}\n\n${code}`;
  }

  return code;
}

  if (lang === "c") {
    const mainStart = code.indexOf("int main()");
    const altMainStart = code.indexOf("void main()");
    const startIndex = mainStart !== -1 ? mainStart : altMainStart;

    if (startIndex === -1) return code; // No main() found, return as-is

    const beforeMain = code.slice(0, startIndex);
    const mainAndAfter = code.slice(startIndex);

    // Just clean up spacing; no prompt injection needed
    const cleanedMain = mainAndAfter
      .split("\n")
      .map(line => line.trimEnd()) // Avoid accidental extra whitespace
      .join("\n");

    return `${beforeMain}${cleanedMain}`;
  }

  return code;
};

  const handleProgramChange = (e) => {
    const selectedId = e.target.value;
    const program = programs.find((p) => p._id === selectedId);
    setSelectedProgram(program);

    if (program) {
      const selectedCode = program.codes.find(
        (code) => code.language?.toLowerCase() === language.toLowerCase()
      );
      setCode(selectedCode?.solution || "");
    } else {
      setCode("");
    }

    setOutput("");
    setTestResults([]);
    setPromptInputs([]);
    setCurrentPrompt("");
    setPromptIndex(0);
  };

 const handleRun = () => {
  setOutput("");
  setPromptInputs([]);     // Reset previous inputs
  setPromptIndex(0);       // Reset prompt index
  setTestResults([]);      // Reset test results

  const uncommentedCode = cleanCode(code);  // Clean the code

  const lang = language.toLowerCase();
  let prompts = [];

  if (lang === "c") {
    // Extract prompts only from inside main()
    let mainStartIndex = code.indexOf("int main()");
    if (mainStartIndex === -1) {
      mainStartIndex = code.indexOf("void main()");
    }

    const codeFromMain = mainStartIndex !== -1 ? code.slice(mainStartIndex) : "";

    const promptRegex = /printf\s*\(\s*"([^"%\\]*?)"\s*\)/g;  // Exclude formatted outputs like "%d"
    let promptMatch;

    while ((promptMatch = promptRegex.exec(codeFromMain)) !== null) {
      prompts.push(promptMatch[1]);
    }
  } else {
    // Default inputRegex handling for JS/Python
    prompts = [...code.matchAll(inputRegex)].map(
      (match) => match[1] || match[2] || match[3]
    );
  }

  console.log("Extracted prompts:", prompts);

  setPromptList(prompts);
  setCurrentPromptCount(prompts.length);

  if (prompts.length > 0) {
    setPromptIndex(0);
    setCurrentPrompt(prompts[0]);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 100);
  } else {
    executeCode(uncommentedCode, "");
  }
};

  const executeCode = (codeToRun, input) => {
    axios
      .post("http://localhost:5000/run", {
        code: codeToRun,
        input,
        language,
      })
      .then((res) => {
        setOutput(res.data.output);
      })
      .catch((err) => {
        console.error(err);
        setOutput("Error running code.");
      });
  };

  const handleInputSubmit = (e) => {
    if (e.key !== "Enter") return;  // Only proceed on Enter key press

    const userInput = inputRef.current.value;
    if (!userInput.trim()) return;  // Don't allow empty inputs

    const updatedInputs = [...promptInputs, userInput];
    setPromptInputs(updatedInputs);

    // Append prompt and input to output
    const fullLine = `${currentPrompt} ${userInput}`;
    setOutput((prev) => prev + fullLine + "\n");

    inputRef.current.value = "";  // Clear input field

    if (promptIndex + 1 < currentPromptCount) {
      // More prompts to collect
      setPromptIndex(promptIndex + 1);
      setCurrentPrompt(promptList[promptIndex + 1]);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 100);  // Focus input field again
    } else {
      // All prompts collected — run the code with all inputs
      const fullInput = updatedInputs.join("\n");
      setCurrentPrompt(null);  // No more prompts to show

      const codeToRun = cleanCode(code);  // Clean the code

      axios
        .post("http://localhost:5000/run", {
          code: codeToRun,
          input: fullInput,
          language,
        })
        .then((res) => {
          setOutput((prev) => prev + res.data.output);  // Append result to output
        })
        .catch((err) => {
          console.error(err);
          setOutput((prev) => prev + "\nError running code.");
        });
    }
  };

  const handleRunTestCases = async () => {
    if (!selectedProgram || !selectedProgram.testCases) {
      console.error("Test cases are not available for the selected program.");
      return;
    }

    setOutput("");
    setTestResults([]);
    setIsRunning(true);

    const uncommentedCode = cleanCode(code);
    const results = [];

    for (const { input, expectedOutput } of selectedProgram.testCases) {
      try {
        const response = await axios.post("http://localhost:5000/run", {
          code: uncommentedCode,
          input,
          language,
        });

        const actualOutput = response.data.output.trim();
        const expected = expectedOutput.trim();
        const passed = actualOutput === expected;

        results.push({
          input,
          expectedOutput: expected,
          actualOutput,
          passed,
        });
      } catch (error) {
        results.push({
          input,
          expectedOutput,
          actualOutput: "Error executing code",
          passed: false,
        });
      }
    }

    setTestResults(results);
    setIsRunning(false);
  };

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <div className="header">
        <div className="left-controls">
          <select
            value={selectedProgram?._id || ""}
            onChange={handleProgramChange}
            className="program-select"
          >
            {programs.map((program) => (
              <option key={program._id} value={program._id}>
                {program.title}
              </option>
            ))}
          </select>

          <button
            className="run-button"
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "Run User Code"}
          </button>

          <button
            className="run-button"
            onClick={handleRunTestCases}
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "Run with Test Cases"}
          </button>

          <select
            className="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>Python</option>
            <option>JavaScript</option>
            <option>Java</option>
            <option>C</option>
            <option>C++</option>
          </select>

          <button className="toggle-btn" onClick={toggleDarkMode}>
            {darkMode ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      <div className="main">
        <div className="editor">
          <div className="problem-statement">
            <p>{selectedProgram?.description}</p>
          </div>

          <div style={{ height: "800px", border: "1px solid #ccc" }}>
            <Editor
              height="100%"
              language={
                language.toLowerCase() === "javascript" ? "javascript" : "python"
              }
              value={code}
              theme={darkMode ? "vs-dark" : "light"}
              onChange={(value) => setCode(value || "")}
            />
          </div>
        </div>

        <div className="output">
          <div className="output-label">Output:</div>
          <div className="console">
            <pre>{output}</pre>

            {currentPrompt && (
              <div className="input-section">
                <span>{currentPrompt}</span>
                <input
                  ref={inputRef}
                  type="text"
                  className="terminal-input-inline"
                  onKeyDown={handleInputSubmit}
                  autoFocus
                />
              </div>
            )}
          </div>

          {testResults.length > 0 && (
            <div className="test-results">
              <h4>Test Case Results:</h4>
              {testResults.map((result, idx) => (
                <div
                  key={idx}
                  className={`test-case ${result.passed ? "pass" : "fail"}`}
                >
                  <strong>Input:</strong>{" "}
                  {result.input ? result.input.split("\n").join(", ") : "No input provided"}
                  <br />
                  <strong>Expected Output:</strong> {result.expectedOutput}
                  <br />
                  <strong>Actual Output:</strong> {result.actualOutput}
                  <br />
                  <strong>Status:</strong>{" "}
                  {result.passed ? "✅ Passed" : "❌ Failed"}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ui;
