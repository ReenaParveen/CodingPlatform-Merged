import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "./Ui.css";

const Ui = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [userInputs, setUserInputs] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [inputIndex, setInputIndex] = useState(0);
  const [testResults, setTestResults] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [language, setLanguage] = useState("Python");
  const inputRef = useRef(null);

  const inputRegex = /input\((["'`])(.*?)\1\)/g;

  // Fetch programs filtered by selected language
  //   useEffect(() => {
  //   const fetchProgramsByLanguage = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:5000/programs");
  //       const filtered = response.data.filter(
  //         (p) =>
  //           typeof p.language === "string" &&
  //           p.language.toLowerCase() === language.toLowerCase()
  //       );
  //       setPrograms(filtered);
  //       if (filtered.length > 0) {
  //         setSelectedProgram(filtered[0]);
  //         setCode(filtered[0].code || "");
  //       } else {
  //         setSelectedProgram(null);
  //         setCode("");
  //       }
  //     } catch (err) {
  //       console.error("Error fetching programs:", err);
  //     }
  //   };

  //   fetchProgramsByLanguage();
  // }, [language]);

 useEffect(() => {
  const fetchProgramsByLanguage = async () => {
    try {
      const response = await axios.get("http://localhost:5000/programs");
      console.log("Programs from API:", response.data);
      console.log("Selected language:", language);

      const filtered = response.data.filter((program) =>
        program.codes.some(
          (code) => code.language?.toLowerCase() === language.toLowerCase()
        )
      );

      console.log("Filtered:", filtered);

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


  useEffect(() => {
    // Clear ResizeObserver warnings (optional)
    const observerErrorHandler = () => {
      let raf = requestAnimationFrame(() => {
        console.clear();
      });
      return () => cancelAnimationFrame(raf);
    };
    observerErrorHandler();
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Remove comments and standardize input() for Python only
  const cleanCode = (code) => {
    if (language.toLowerCase() === "python") {
      return code
        .split("\n")
        .filter((line) => !line.trim().startsWith("#"))
        .join("\n")
        .replace(/input\s*\(\s*["'][^"']*["']\s*\)/g, "input()");
    }
    // For JS or other languages, return code as is
    return code;
  };

  const handleProgramChange = (e) => {
    const selectedId = e.target.value;
    const program = programs.find((p) => p._id === selectedId);
    setSelectedProgram(program);
    setCode(program?.code || ""); // ✅ Set the code here
    setOutput("");
    setTestResults([]);
    setUserInputs([]);
    setCurrentPrompt("");
    setInputIndex(0);
  };

  const handleRun = () => {
    setOutput("");
    setUserInputs([]);
    setInputIndex(0);
    setTestResults([]);

    const uncommentedCode = cleanCode(code);
    const prompts =
      language.toLowerCase() === "python"
        ? [...code.matchAll(inputRegex)].map((match) => match[2])
        : []; // No prompt detection for JS (or you can add if needed)

    if (prompts.length > 0) {
      setCurrentPrompt(prompts[0]);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 100);
    } else {
      executeCode(uncommentedCode, "");
    }
  };

  const handleInputSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.target.value;
      const updatedInputs = [...userInputs, input];
      setUserInputs(updatedInputs);

      const prompts = [...code.matchAll(inputRegex)].map((match) => match[2]);
      const nextIndex = inputIndex + 1;

      setOutput((prev) => prev + `${currentPrompt} ${input}\n`);

      if (nextIndex < prompts.length) {
        setCurrentPrompt(prompts[nextIndex]);
        setInputIndex(nextIndex);
        e.target.value = "";
        setTimeout(() => inputRef.current?.focus(), 100);
      } else {
        const finalInput = updatedInputs.join("\n");
        const uncommentedCode = cleanCode(code);
        executeCode(uncommentedCode, finalInput);
      }
    }
  };

  const executeCode = async (codeToRun, inputToSend) => {
    setIsRunning(true);
    try {
      const response = await axios.post("http://localhost:5000/run", {
        code: codeToRun,
        input: inputToSend,
        language,
      });
      setOutput((prev) => prev + response.data.output);
    } catch (error) {
      setOutput("Error: Unable to execute code.");
      console.error(error);
    }
    setIsRunning(false);
    setCurrentPrompt("");
    setInputIndex(0);
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
            language={language.toLowerCase() === "javascript" ? "javascript" : "python"}
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
                  {result.input
                    ? result.input.split("\n").join(", ")
                    : "No input provided"}
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