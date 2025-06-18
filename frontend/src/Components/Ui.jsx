// import React, { useState, useRef, useEffect } from "react";
// import Editor from "@monaco-editor/react";
// import axios from "axios";
// import "./Ui.css";

// const Ui = () => {
//   const [darkMode, setDarkMode] = useState(false);
//   const [code, setCode] = useState("");
//   const [output, setOutput] = useState("");
//   const [isRunning, setIsRunning] = useState(false);
//   const [testResults, setTestResults] = useState([]);
//   const [programs, setPrograms] = useState([]);
//   const [selectedProgram, setSelectedProgram] = useState(null);
//   const [language, setLanguage] = useState("Python");
//   const [promptInputs, setPromptInputs] = useState([]);
//   const [promptList, setPromptList] = useState([]);
//   const [currentPromptCount, setCurrentPromptCount] = useState(0);
//   const [promptIndex, setPromptIndex] = useState(0);
//   const [currentPrompt, setCurrentPrompt] = useState("");

//   const inputRef = useRef(null);

//   useEffect(() => {
//     const fetchProgramsByLanguage = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/programs");
//         const filtered = response.data.filter((program) =>
//           program.codes.some(
//             (code) => code.language?.toLowerCase() === language.toLowerCase()
//           )
//         );

//         setPrograms(filtered);
//         if (filtered.length > 0) {
//           const selected = filtered[0];
//           const selectedCode = selected.codes.find(
//             (code) => code.language?.toLowerCase() === language.toLowerCase()
//           );
//           setSelectedProgram(selected);
//           setCode(selectedCode?.solution || "");
//         } else {
//           setSelectedProgram(null);
//           setCode("");
//         }
//       } catch (error) {
//         console.error("Failed to fetch programs:", error);
//       }
//     };

//     if (language) {
//       fetchProgramsByLanguage();
//     }
//   }, [language]);

//   const toggleDarkMode = () => setDarkMode(!darkMode);

//   const cleanCode = (code) => {
//     const lang = language.toLowerCase();

//     if (lang === "python") {
//       return code
//         .split("\n")
//         .filter((line) => !line.trim().startsWith("#"))
//         .join("\n");
//     }

//     return code;
//   };

//   const extractPrompts = (code, lang) => {
//     const prompts = [];
//     const lines = code.split("\n");

//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i].trim();

//       if (lang === "python" && line.includes("input(")) {
//         const inside = line.split("input(")[1]?.split(")")[0]?.replace(/['"`]/g, "").trim();
//         if (inside) prompts.push(inside);
//       }

//       else if (lang === "javascript" && line.includes("prompt(")) {
//         const inside = line.split("prompt(")[1]?.split(")")[0]?.replace(/['"`]/g, "").trim();
//         if (inside) prompts.push(inside);
//       }

//       else if (lang === "c" && line.includes("printf(")) {
//         const text = line.split("printf(")[1]?.split(")")[0]?.replace(/['"`]/g, "").trim();
//         let hasScanf = false;
//         for (let j = i + 1; j <= i + 3 && j < lines.length; j++) {
//           if (lines[j].includes("scanf(")) {
//             hasScanf = true;
//             break;
//           }
//         }
//         if (hasScanf && text) prompts.push(text);
//       }

//       else if (lang === "java" && line.includes("System.out.print")) {
//         const text = line.split("System.out.print")[1]?.split(")")[0]?.replace(/[('"`)]/g, "").trim();
//         let hasScanner = false;
//         for (let j = i + 1; j <= i + 5 && j < lines.length; j++) {
//           if (lines[j].includes(".next")) {
//             hasScanner = true;
//             break;
//           }
//         }
//         if (hasScanner && text) prompts.push(text);
//       }

//       else if (lang === "java" && line.includes("System.out.println")) {
//         const text = line.split("System.out.println")[1]?.split(")")[0]?.replace(/[('"`)]/g, "").trim();
//         for (let j = i + 1; j <= i + 5 && j < lines.length; j++) {
//           if (lines[j].includes(".next")) {
//             if (text && !prompts.includes(text)) {
//               prompts.push(text);
//             }
//             break;
//           }
//         }
//       }

//       else if ((lang === "cpp" || lang === "c++") && line.includes("cout <<")) {
//         const parts = line.split("<<").map(p => p.trim());
//         const quoted = parts.find(p => p.startsWith('"') || p.startsWith("'"));
//         if (quoted) {
//           const cleaned = quoted.replace(/['"`]/g, "").trim();
//           let hasCin = false;
//           for (let j = i + 1; j <= i + 3 && j < lines.length; j++) {
//             if (lines[j].includes("cin >>")) {
//               hasCin = true;
//               break;
//             }
//           }
//           if (hasCin && cleaned) prompts.push(cleaned);
//         }
//       }
//     }

//     return prompts;
//   };

//   const handleProgramChange = (e) => {
//     const selectedId = e.target.value;
//     const program = programs.find((p) => p._id === selectedId);
//     setSelectedProgram(program);

//     if (program) {
//       const selectedCode = program.codes.find(
//         (code) => code.language?.toLowerCase() === language.toLowerCase()
//       );
//       setCode(selectedCode?.solution || "");
//     } else {
//       setCode("");
//     }

//     setOutput("");
//     setTestResults([]);
//     setPromptInputs([]);
//     setCurrentPrompt("");
//     setPromptIndex(0);
//   };

//   const handleRun = () => {
//     setOutput("");
//     setPromptInputs([]);
//     setPromptIndex(0);
//     setTestResults([]);

//     const uncommentedCode = cleanCode(code);
//     const lang = language.toLowerCase();
//     const prompts = extractPrompts(code, lang);

//     setPromptList(prompts);
//     setCurrentPromptCount(prompts.length);

//     if (prompts.length > 0) {
//       setPromptIndex(0);
//       setCurrentPrompt(prompts[0]);
//       setTimeout(() => inputRef.current?.focus(), 100);
//     } else {
//       executeCode(uncommentedCode, "");
//     }
//   };

//   const executeCode = (codeToRun, input) => {
//     axios
//       .post("http://localhost:5000/run", {
//         code: codeToRun,
//         input,
//         language,
//       })
//       .then((res) => setOutput(res.data.output))
//       .catch((err) => {
//         console.error(err);
//         setOutput("Error running code.");
//       });
//   };

//   const handleInputSubmit = (e) => {
//     if (e.key !== "Enter") return;

//     const userInput = inputRef.current.value.trim();
//     if (!userInput) return;

//     const updatedInputs = [...promptInputs, userInput];
//     setPromptInputs(updatedInputs);

//     const updatedLine = `${currentPrompt} ${userInput}`;
//     setOutput((prev) => (prev ? `${prev}\n${updatedLine}` : updatedLine));

//     inputRef.current.value = "";

//     if (promptIndex + 1 < currentPromptCount) {
//       setPromptIndex(promptIndex + 1);
//       setCurrentPrompt(promptList[promptIndex + 1]);
//       setTimeout(() => inputRef.current?.focus(), 100);
//     } else {
//       const fullInput = updatedInputs.join("\n");
//       setCurrentPrompt(null);
//       const codeToRun = cleanCode(code);

//       axios
//         .post("http://localhost:5000/run", {
//           code: codeToRun,
//           input: fullInput,
//           language,
//         })
//         .then((res) => {
//           const backendLines = res.data.output.trim().split("\n");

//           const filteredOutput = backendLines.filter((line) => {
//             const trimmed = line.trim();
//             return (
//               trimmed.length > 0 &&
//               !promptList.some(
//                 (prompt) =>
//                   prompt.trim() === trimmed || trimmed.startsWith(prompt.trim())
//               )
//             );
//           }).join("\n");

//           setOutput((prev) => `${prev}\n${filteredOutput}`);
//         })
//         .catch((err) => {
//           console.error(err);
//           setOutput((prev) => `${prev}\nError running code.`);
//         });
//     }
//   };

//   const handleRunTestCases = async () => {
//     if (!selectedProgram?.testCases) return;

//     setOutput("");
//     setTestResults([]);
//     setIsRunning(true);

//     const uncommentedCode = cleanCode(code);
//     const results = [];

//     for (const { input, expectedOutput } of selectedProgram.testCases) {
//       try {
//         const response = await axios.post("http://localhost:5000/run", {
//           code: uncommentedCode,
//           input,
//           language,
//         });

//         const actualOutput = response.data.output.trim();
//         const expected = expectedOutput.trim();
//         const passed = actualOutput === expected;

//         results.push({ input, expectedOutput: expected, actualOutput, passed });
//       } catch {
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
//             value={selectedProgram?._id || ""}
//             onChange={handleProgramChange}
//             className="program-select"
//           >
//             {programs.map((program) => (
//               <option key={program._id} value={program._id}>
//                 {program.title}
//               </option>
//             ))}
//           </select>

//           <button className="run-button" onClick={handleRun} disabled={isRunning}>
//             {isRunning ? "Running..." : "Run User Code"}
//           </button>

//           <button
//             className="run-button"
//             onClick={handleRunTestCases}
//             disabled={isRunning}
//           >
//             {isRunning ? "Running..." : "Run with Test Cases"}
//           </button>

//           <select
//             className="language-select"
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//           >
//             <option>Python</option>
//             <option>JavaScript</option>
//             <option>Java</option>
//             <option>C</option>
//             <option>C++</option>
//           </select>

//           <button className="toggle-btn" onClick={toggleDarkMode}>
//             {darkMode ? "🌞 Light" : "🌙 Dark"}
//           </button>
//         </div>
//       </div>

//       <div className="main">
//         <div className="editor">
//           <div className="problem-statement">
//             <p>{selectedProgram?.description}</p>
//           </div>

//           <div style={{ height: "800px", border: "1px solid #ccc" }}>
//             <Editor
//               height="100%"
//               language={language.toLowerCase() === "javascript" ? "javascript" : "python"}
//               value={code}
//               theme={darkMode ? "vs-dark" : "light"}
//               onChange={(value) => setCode(value || "")}
//             />
//           </div>
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
//                   <strong>Input:</strong> {result.input.split("\n").join(", ")}<br />
//                   <strong>Expected Output:</strong> {result.expectedOutput}<br />
//                   <strong>Actual Output:</strong> {result.actualOutput}<br />
//                   <strong>Status:</strong> {result.passed ? "✅ Passed" : "❌ Failed"}
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
        .join("\n");
    }

    return code;
  };

  const extractPrompts = (code, lang) => {
    const prompts = [];
    const lines = code.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (lang === "python" && line.includes("input(")) {
        const inside = line.split("input(")[1]?.split(")")[0]?.replace(/['"`]/g, "").trim();
        if (inside) prompts.push(inside);
      }

      else if (lang === "javascript" && line.includes("prompt(")) {
        const inside = line.split("prompt(")[1]?.split(")")[0]?.replace(/['"`]/g, "").trim();
        if (inside) prompts.push(inside);
      }

      else if (lang === "c" && line.includes("printf(")) {
        const text = line.split("printf(")[1]?.split(")")[0]?.replace(/['"`]/g, "").trim();
        let hasScanf = false;
        for (let j = i + 1; j <= i + 3 && j < lines.length; j++) {
          if (lines[j].includes("scanf(")) {
            hasScanf = true;
            break;
          }
        }
        if (hasScanf && text) prompts.push(text);
      }

      else if (lang === "java" && line.includes("System.out.print")) {
        const text = line.split("System.out.print")[1]?.split(")")[0]?.replace(/[('"`)]/g, "").trim();
        let hasScanner = false;
        for (let j = i + 1; j <= i + 5 && j < lines.length; j++) {
          if (lines[j].includes(".next")) {
            hasScanner = true;
            break;
          }
        }
        if (hasScanner && text) prompts.push(text);
      }

      else if (lang === "java" && line.includes("System.out.println")) {
        const text = line.split("System.out.println")[1]?.split(")")[0]?.replace(/[('"`)]/g, "").trim();
        for (let j = i + 1; j <= i + 5 && j < lines.length; j++) {
          if (lines[j].includes(".next")) {
            if (text && !prompts.includes(text)) {
              prompts.push(text);
            }
            break;
          }
        }
      }

      else if ((lang === "cpp" || lang === "c++") && line.includes("cout <<")) {
        const parts = line.split("<<").map(p => p.trim());
        const quoted = parts.find(p => p.startsWith('"') || p.startsWith("'"));
        if (quoted) {
          const cleaned = quoted.replace(/['"`]/g, "").trim();
          let hasCin = false;
          for (let j = i + 1; j <= i + 3 && j < lines.length; j++) {
            if (lines[j].includes("cin >>")) {
              hasCin = true;
              break;
            }
          }
          if (hasCin && cleaned) prompts.push(cleaned);
        }
      }
    }

    return prompts;
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
    setPromptInputs([]);
    setPromptIndex(0);
    setTestResults([]);

    const uncommentedCode = cleanCode(code);
    const lang = language.toLowerCase();
    const prompts = extractPrompts(code, lang);

    setPromptList(prompts);
    setCurrentPromptCount(prompts.length);

    if (prompts.length > 0) {
      setPromptIndex(0);
      setCurrentPrompt(prompts[0]);
      setTimeout(() => inputRef.current?.focus(), 100);
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
      .then((res) => setOutput(res.data.output))
      .catch((err) => {
        console.error(err);
        setOutput("Error running code.");
      });
  };

  const handleInputSubmit = (e) => {
  if (e.key !== "Enter") return;

  const userInput = inputRef.current.value.trim();
  if (!userInput) return;

  const updatedInputs = [...promptInputs, userInput];
  setPromptInputs(updatedInputs);

  // 👇 This makes it show: Enter first number: 2
  const promptLine = `${currentPrompt} ${userInput}`;
  setOutput((prev) => (prev ? `${prev}\n${promptLine}` : promptLine));

  inputRef.current.value = "";

  if (promptIndex + 1 < currentPromptCount) {
    setPromptIndex(promptIndex + 1);
    setCurrentPrompt(promptList[promptIndex + 1]);
    setTimeout(() => inputRef.current?.focus(), 100);
  } else {
    const fullInput = updatedInputs.join("\n");
    setCurrentPrompt(null);

    const codeToRun = cleanCode(code);

    axios
  .post("http://localhost:5000/run", {
    code: codeToRun,
    input: fullInput,
    language,
  })
  .then((res) => {
    const rawLines = res.data.output.trim().split('\n');

    const filtered = rawLines.filter((line) => {
      const lowerLine = line.toLowerCase();
      return !promptList.some((prompt) =>
        lowerLine.includes(prompt.toLowerCase().trim())
      );
    });

    const finalOutput = filtered.length > 0
      ? filtered.join('\n')
      : res.data.output.trim();

    setOutput((prev) => `${prev}\n${finalOutput}`);
  })
  .catch((err) => {
    console.error(err);
    setOutput("Error running code.");
  });

  }
};


  const handleRunTestCases = async () => {
    if (!selectedProgram?.testCases) return;

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

        results.push({ input, expectedOutput: expected, actualOutput, passed });
      } catch {
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

          <button className="run-button" onClick={handleRun} disabled={isRunning}>
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
                  <strong>Input:</strong> {result.input.split("\n").join(", ")}<br />
                  <strong>Expected Output:</strong> {result.expectedOutput}<br />
                  <strong>Actual Output:</strong> {result.actualOutput}<br />
                  <strong>Status:</strong> {result.passed ? "✅ Passed" : "❌ Failed"}
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
