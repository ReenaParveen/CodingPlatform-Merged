// import React, { useState, useRef, useEffect } from "react";
// import Editor from "@monaco-editor/react";
// import axios from "axios";
// // import programs from "./Program";
// import "./Ui.css";

// const Ui = () => {
//   const [darkMode, setDarkMode] = useState(false);
//   // const [selectedProgram, setSelectedProgram] = useState(programs[0]);
//   const [code, setCode] = useState(""); // Blank editor
//   const [output, setOutput] = useState("");
//   const [isRunning, setIsRunning] = useState(false);
//   const [userInputs, setUserInputs] = useState([]);
//   const [currentPrompt, setCurrentPrompt] = useState("");
//   const [inputIndex, setInputIndex] = useState(0);
//   const inputRef = useRef(null);
//   const [testResults, setTestResults] = useState([]);
//   const [programs, setPrograms] = useState([]);
//   const [selectedProgram, setSelectedProgram] = useState(null);

//   useEffect(() => {
//   const fetchPrograms = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/programs");
//       setPrograms(response.data);
//       if (response.data.length > 0) {
//         setSelectedProgram(response.data[0]); // optionally select first one
//       }
//     } catch (error) {
//       console.error("Error fetching programs:", error);
//     }
//   };

//   fetchPrograms();
// }, []);

//   const inputRegex = /input\((["'`])(.*?)\1\)/g;

//   const toggleDarkMode = () => setDarkMode(!darkMode);

//   const cleanCode = (code) =>
//     code
//       .split("\n")
//       .filter((line) => !line.trim().startsWith("#"))
//       .join("\n")
//       .replace(/input\s*\(\s*["'][^"']*["']\s*\)/g, "input()");

//   const handleProgramChange = (e) => {
//     const program = programs.find((p) => p.id === parseInt(e.target.value));
//     setSelectedProgram(program);
//     setCode(""); // Keep editor blank
//     setOutput("");
//     setTestResults([]);
//     setUserInputs([]);
//     setCurrentPrompt("");
//     setInputIndex(0);
//   };

//   const handleRun = () => {
//     setOutput("");
//     setUserInputs([]);
//     setInputIndex(0);
//     setTestResults([]);

//     const uncommentedCode = cleanCode(code);
//     const prompts = [...code.matchAll(inputRegex)].map((match) => match[2]);

//     if (prompts.length > 0) {
//       setCurrentPrompt(prompts[0]);
//       setTimeout(() => inputRef.current && inputRef.current.focus(), 100);
//     } else {
//       executeCode(uncommentedCode, "");
//     }
//   };

//   const handleInputSubmit = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const input = e.target.value;
//       const updatedInputs = [...userInputs, input];
//       setUserInputs(updatedInputs);

//       const prompts = [...code.matchAll(inputRegex)].map((match) => match[2]);
//       const nextIndex = inputIndex + 1;

//       setOutput((prev) => prev + `${currentPrompt} ${input}\n`);

//       if (nextIndex < prompts.length) {
//         setCurrentPrompt(prompts[nextIndex]);
//         setInputIndex(nextIndex);
//         e.target.value = "";
//         setTimeout(() => inputRef.current && inputRef.current.focus(), 100);
//       } else {
//         const finalInput = updatedInputs.join("\n");
//         const uncommentedCode = cleanCode(code);
//         executeCode(uncommentedCode, finalInput);
//       }
//     }
//   };

//   const executeCode = async (codeToRun, inputToSend) => {
//     setIsRunning(true);
//     try {
//       const response = await axios.post("http://localhost:5000/run", {
//         code: codeToRun,
//         input: inputToSend,
//       });
//       setOutput((prev) => prev + response.data.output);
//     } catch (error) {
//       setOutput("Error: Unable to execute code.");
//       console.error(error);
//     }
//     setIsRunning(false);
//     setCurrentPrompt("");
//     setInputIndex(0);
//   };

//   const handleRunTestCases = async () => {
//     setOutput("");
//     setTestResults([]);
//     setIsRunning(true);

//     const uncommentedCode = cleanCode(code);
//     const results = [];

//     for (let i = 0; i < selectedProgram.testCases.length; i++) {
//       const { input, expectedOutput } = selectedProgram.testCases[i];
//       try {
//         const response = await axios.post("http://localhost:5000/run", {
//           code: uncommentedCode,
//           input: input,
//         });

//         const actualOutput = response.data.output.trim();
//         const expected = expectedOutput.trim();
//         const passed = actualOutput === expected;

//         results.push({
//           input,
//           expectedOutput: expected,
//           actualOutput: actualOutput,
//           passed,
//         });
//       } catch (error) {
//         results.push({
//           input,
//           expectedOutput,
//           actualOutput: "Error executing code",
//           passed: false,
//         });
//       }
//     }

//     setTestResults(results);
//     setIsRunning(false);
//   };

//   return (
//     <div className={`container ${darkMode ? "dark" : ""}`}>
//       <div className="header">
//         <div className="left-controls">
//           <select
//             value={selectedProgram?.id || ""}
//             onChange={handleProgramChange}
//             className="program-select"
//           >
//             {programs.map((p) => (
//               <option key={p.id} value={p.id}>
//                 {p.title}
//               </option>
//             ))}
//           </select>
//           <button
//             className="run-button"
//             onClick={handleRun}
//             disabled={isRunning}
//           >
//             {isRunning ? "Running..." : "Run User Code"}
//           </button>

//           <button
//             className="run-button"
//             onClick={handleRunTestCases}
//             disabled={isRunning}
//           >
//             {isRunning ? "Running..." : "Run with Test Cases"}
//           </button>

//           <select className="language-select" disabled>
//             <option>Python</option>
//           </select>
//         </div>

//         <button className="toggle-btn" onClick={toggleDarkMode}>
//           {darkMode ? "🌞 Light" : "🌙 Dark"}
//         </button>
//       </div>

//       <div className="main">
//         <div className="editor">
//           <div className="problem-statement">
//             {/* <h3>Problem Statement:{selectedProgram.description}</h3> */}
//             <p>{selectedProgram.description}</p>
//           </div>

//           <Editor
//             height="100%"
//             defaultLanguage="python"
//             value={code}
//             theme={darkMode ? "vs-dark" : "light"}
//             onChange={(value) => setCode(value || "")}
//           />
//         </div>

//         <div className="output">
//           <div className="output-label">Output:</div>
//           <div className="console">
//             <pre>{output}</pre>
//             {currentPrompt && (
//               <div className="input-section">
//                 <span>{currentPrompt}</span>
//                 <input
//                   ref={inputRef}
//                   type="text"
//                   className="terminal-input-inline"
//                   onKeyDown={handleInputSubmit}
//                   autoFocus
//                 />
//               </div>
//             )}
//           </div>

//           {testResults.length > 0 && (
//             <div className="test-results">
//               <h4>Test Case Results:</h4>
//               {testResults.map((result, idx) => (
//                 <div
//                   key={idx}
//                   className={`test-case ${result.passed ? "pass" : "fail"}`}
//                 >
//                   <strong>Input:</strong>{" "}
//                   {result.input.split("\n").join(", ")}
//                   <br />
//                   <strong>Expected Output:</strong> {result.expectedOutput}
//                   <br />
//                   <strong>Actual Output:</strong> {result.actualOutput}
//                   <br />
//                   <strong>Status:</strong>{" "}
//                   {result.passed ? "✅ Passed" : "❌ Failed"}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Ui;

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
  const inputRef = useRef(null);
  const [testResults, setTestResults] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const inputRegex = /input\((["'`])(.*?)\1\)/g;

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/programs");
        setPrograms(response.data);
        if (response.data.length > 0) {
          setSelectedProgram(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const cleanCode = (code) =>
    code
      .split("\n")
      .filter((line) => !line.trim().startsWith("#"))
      .join("\n")
      .replace(/input\s*\(\s*["'][^"']*["']\s*\)/g, "input()");

  const handleProgramChange = (e) => {
    const selectedId = e.target.value;
    const program = programs.find((p) => p._id === selectedId);
    setSelectedProgram(program);
    setCode("");
    setOutput("");
    setTestResults([]);
    setUserInputs([]);
    setCurrentPrompt("");
    setInputIndex(0);
  };

  // const handleRun = () => {
  //   setOutput("");
  //   setUserInputs([]);
  //   setInputIndex(0);
  //   setTestResults([]);

  //   const uncommentedCode = cleanCode(code);
  //   const prompts = [...code.matchAll(inputRegex)].map((match) => match[2]);

  //   if (prompts.length > 0) {
  //     setCurrentPrompt(prompts[0]);
  //     setTimeout(() => inputRef.current && inputRef.current.focus(), 100);
  //   } else {
  //     executeCode(uncommentedCode, "");
  //   }
  // };

 const handleRun = () => {
    setOutput("");
    setUserInputs([]);
    setInputIndex(0);
    setTestResults([]);

    const uncommentedCode = cleanCode(code);
    const prompts = [...code.matchAll(inputRegex)].map((match) => match[2]);

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

          <select className="language-select" disabled>
            <option>Python</option>
          </select>
        </div>

        <button className="toggle-btn" onClick={toggleDarkMode}>
          {darkMode ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="main">
        <div className="editor">
          <div className="problem-statement">
            <p>{selectedProgram?.description}</p>
          </div>

          <Editor
            height="100%"
            defaultLanguage="python"
            value={code}
            theme={darkMode ? "vs-dark" : "light"}
            onChange={(value) => setCode(value || "")}
          />
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
