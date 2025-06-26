import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "./Ui.css";

const Ui = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [code, setCode] = useState("");
  const [outputLines, setOutputLines] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [language, setLanguage] = useState("Python");
  const [currentPrompt, setCurrentPrompt] = useState(false);
  const inputRef = useRef(null);
  const outputEndRef = useRef(null);
  useEffect(() => outputEndRef.current?.scrollIntoView({ behavior: "smooth" }), [outputLines]);

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
    fetchProgramsByLanguage();
  }, [language]);

  const cleanCode = (code) => {
    if (language.toLowerCase() === "python") {
      return code
        .split("\n")
        .filter((line) => !line.trim().startsWith("#"))
        .join("\n");
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

    setOutputLines([]);
    setCurrentPrompt(null);
  };

  const executeCode = (codeToRun) => {
    setOutputLines([]);
    setCurrentPrompt(null);
    setIsRunning(true);

    const eventSource = new EventSource(
      `http://localhost:5000/run-stream?code=${encodeURIComponent(codeToRun)}&language=${encodeURIComponent(language)}`
    );

    // eventSource.onmessage = (e) => {
    //   let cleanData = e.data
    //     .replace(/\r\n/g, "\n")
    //     .replace(/\x1B\[[0-9;]*[A-Za-z]/g, "")
    //     .replace(/\x1B\].*?\x07/g, "")
    //     .replace(/\x07/g, "")
    //     .replace(/\x1B\[\?25[h|l]/g, "");

    //   setOutputLines((prev) => prev + cleanData);

    //   // Check if the last part of the output looks like a prompt
    //   if (cleanData.trim().endsWith(":")) {
    //     setCurrentPrompt((prev) => (prev || "") + cleanData);
    //     setTimeout(() => inputRef.current?.focus(), 50);
    //   }
    // };

    eventSource.onmessage = (e) => {
      let cleanData = e.data
        .replace(/\r\n/g, "\n")
        .replace(/\x1B\[[0-9;]*[A-Za-z]/g, "")
        .replace(/\x1B\].*?\x07/g, "")
        .replace(/\x07/g, "")
        .replace(/\x1B\[\?25[h|l]/g, "");

      // Split into newlines
      const lines = cleanData.split("\n");

      setOutputLines((prev) => [...prev, ...lines]);

      if (cleanData.trim().endsWith(":")) {
        setCurrentPrompt(cleanData);  // show the prompt separately
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    };

    // eventSource.onmessage = (e) => {
    //   let cleanData = e.data
    //     .replace(/\r/g, "") // strip carriage returns
    //     .replace(/\x1B\[[0-9;]*[A-Za-z]/g, "") // strip ANSI codes
    //     .replace(/\x1B\].*?\x07/g, "")
    //     .replace(/\x07/g, "")
    //     .replace(/\x1B\[\?25[h|l]/g, "");

    //   setOutputLines((prev) => prev + cleanData); // Append to output shown in <pre>

    //   // Check if the output ends with a colon — that’s probably a prompt
    //   if (cleanData.trim().endsWith(":")) {
    //     setCurrentPrompt(true); // Show input box
    //     setTimeout(() => inputRef.current?.focus(), 50); // Focus input
    //   }
    // };



    // if (cleanData.trim().endsWith(":")) {
    //   // Remove the last prompt line from output
    //   setOutputLines((prevLines) => prevLines.slice(0, -1));
    //   setCurrentPrompt(cleanData);
    //   setTimeout(() => inputRef.current?.focus(), 50);
    // }

    eventSource.onerror = () => {
      eventSource.close();
      setIsRunning(false);
    };
  };

  const handleRun = () => {
    executeCode(cleanCode(code));
  };

  // const handleInputSubmit = async (e) => {
  //   if (e.key === "Enter") {
  //     const value = inputRef.current.value;
  //     inputRef.current.value = "";
  //     setCurrentPrompt(null);
  //     await axios.post("http://localhost:5000/send-input", { input: value });
  //   }
  // };

  const handleInputSubmit = async (e) => {
    if (e.key === "Enter") {
      const value = inputRef.current.value;
      inputRef.current.value = "";
      // Save prompt as part of output
      setOutputLines((prev) => [...prev, currentPrompt + value]);
      setCurrentPrompt(null);
      await axios.post("http://localhost:5000/send-input", { input: value });
    }
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

          <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
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
            {/* <pre style={{ whiteSpace: "pre", fontFamily: "monospace" }}>{outputLines}</pre> */}
            <pre style={{ whiteSpace: "pre", fontFamily: "monospace" }}>
            {outputLines.map((line, index) => <div key={index}>{line}</div>)}
            <div ref={outputEndRef} />
          </pre>
            {/* <pre style={{ whiteSpace: "pre", fontFamily: "monospace" }}>{outputLines}</pre> */}
            {currentPrompt && (
              <input
                ref={inputRef}
                type="text"
                className="terminal-input-inline"
                onKeyDown={handleInputSubmit}
                autoFocus
                placeholder="Your input"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ui;
