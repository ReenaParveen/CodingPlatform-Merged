const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const codeService = require('./Services/codeService')
const pty = require('node-pty');
const { spawnSync } = require('child_process');
const app = express();
const PORT = process.env.PORT || 5000;
const os = require('os');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/codePlatform");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("✅ Connected to MongoDB"));

// Ensure /temp folder exists
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// === Schema and Model ===
const programSchema = new mongoose.Schema({
  title: { type: String, required: true },
  codes: [
    {
      language: {
        type: String,
        enum: ["Python", "JavaScript", "C", "Java"],
        required: true,
      },
      solution: { type: String, required: true },
    },
  ],
  testCases: [
    {
      input: String,
      expectedOutput: String,
    },
  ],
});

const Program = mongoose.model("Program", programSchema);

// === Replaced /run logic with custom service ===
// app.post("/run", async (req, res) => {
//   const { code, input, language } = req.body;
//   console.log("code",code);
//   console.log("input",input);
//   console.log("language",language);


//   console.log("📥 Code Run Request:", { language, input });

//   try {
//     let output;

//     if (language === "Python") {
//       console.log("input called");
//       console.log("python code exceuted");
//       output = await codeService.compileAndRunPythonCode(code, input || '');
//       console.log("output",output);
//     } else if (language === "JavaScript") {
//       console.log("javascript code exceuted");
//       output = await codeService.executeJavaScriptCode(code);
//       console.log(output);
//     } else if (language === "Java") {
//       console.log("Java code exceuted");
//       output = await codeService.compileAndRunCode(code, input || '');
//       console.log(output);
//     } else {
//       return res.status(400).json({ output: `Language '${language}' not supported.` });
//     }

//     res.json({ output: output.trim() });
//   } catch (err) {
//     console.error("🔥 BACKEND ERROR:", err);
//     res.status(500).json({ output: err.message || "Server Error" });
//   }
// });

// Keep a reference to the current PTY process
let ptyProcess = null;


// --- STREAMING ROUTE FOR RUNNING PYTHON CODE --- //
// app.get('/run-stream', (req, res) => {
//   const { code,language } = req.query;
//   console.log("language",language);
//   if (!code) return res.status(400).send('Missing code');

//   const tempDir = path.join(__dirname, 'temp');
//   if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

//   const filePath = path.join(tempDir, 'main.py');
//   fs.writeFileSync(filePath, code, { encoding: 'utf-8' });

//   res.writeHead(200, {
//     'Content-Type': 'text/event-stream',
//     'Cache-Control': 'no-cache',
//     Connection: 'keep-alive',
//   });

//   ptyProcess = pty.spawn(
//     process.platform === 'win32' ? 'C:\\Python312\\python.exe' : 'python3',
//     ['-u', filePath],
//     {
//       cols: 80,
//       rows: 24,
//       name: 'vt100',
//       env: { ...process.env, TERM: "dumb" }
//     }
//   );

//   ptyProcess.on('data', (data) => {
//     // ✅ Remove all escape codes
//     const cleanData = data
//       .replace(/\x1B\[[0-9;]*[A-Za-z]/g, '')
//       .replace(/\x1B\].*?\x07/g, '')
//       .replace(/\x07/g, '')
//       .replace(/\x1B\[\?25[h|l]/g, '');
//     console.log('Clean output:', JSON.stringify(cleanData));
//     res.write(`data: ${cleanData}\n\n`);
//   });

//   ptyProcess.on('exit', (code) => {
//     res.write(`data: \n\n`);
//     res.end();
//     ptyProcess = null;
//   });

//   req.on('close', () => {
//     if (ptyProcess) {
//       ptyProcess.kill();
//       ptyProcess = null;
//     }
//   });
// });


app.get('/run-stream', (req, res) => {
  console.log('PATH:', process.env.PATH);
  console.log("encoutered run stream function");
  let { code, language } = req.query;
  console.log("language",language)

  if (!code) return res.status(400).send('Missing code');
  if (!language) return res.status(400).send('Missing language');

  language = language.toLowerCase();

  const tempDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  let filePath;
  let runCommand;
  let args = [];

  if (language === 'c++') {
    filePath = path.join(tempDir, 'main.cpp');
    fs.writeFileSync(filePath, code, { encoding: 'utf-8' });

    const isWindows = os.platform() === 'win32';
    const outputExe = path.join(tempDir, isWindows ? 'a.exe' : 'a.out');

    // Compile C++ file
    try {
      const compileCmd = 'g++';
      const compileArgs = [filePath, '-o', outputExe];
      const compile = spawnSync(compileCmd, compileArgs, { encoding: 'utf-8' });

      if (compile.error) {
        console.log("compile.error",compile.error);
        return res.status(500).send(`Compilation failed: ${compile.error.message}`);
      }
      if (compile.stderr) {
        console.log("compile.stderr",compile.stderr);
        return res.status(500).send(`Compilation failed:\n${compile.stderr}`);
      }

      runCommand = outputExe;
      console.log("runCommand",runCommand)
    } catch (e) {
      return res.status(500).send(`Compilation error: ${e.message}`);
    }

  } else if (language === 'python') {
    filePath = path.join(tempDir, 'main.py');
    fs.writeFileSync(filePath, code, { encoding: 'utf-8' });

    runCommand = os.platform() === 'win32' ? 'C:\\Python312\\python.exe' : 'python3';
    args = ['-u', filePath];
  } else {
    return res.status(400).send('Unsupported language.');
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  ptyProcess = pty.spawn(
    runCommand,
    args,
    {
      cols: 80,
      rows: 24,
      name: 'vt100',
      env: { ...process.env, TERM: "dumb" }
    }
  );

  ptyProcess.on('data', (data) => {
    const cleanData = data
      .replace(/\x1B\[[0-9;]*[A-Za-z]/g, '')
      .replace(/\x1B\].*?\x07/g, '')
      .replace(/\x07/g, '')
      .replace(/\x1B\[\?25[h|l]/g, '');
    console.log('Clean output:', JSON.stringify(cleanData));
    res.write(`data: ${cleanData}\n\n`);
  });

  ptyProcess.on('exit', () => {
    res.write('data: \n\n');
    res.end();
    ptyProcess = null;
  });

  req.on('close', () => {
    if (ptyProcess) {
      ptyProcess.kill();
      ptyProcess = null;
    }
  });
});




app.post('/send-input', (req, res) => {
  const { input } = req.body;
  if (!input) return res.status(400).send('No input provided');

  if (ptyProcess) {
    ptyProcess.write(input + '\r'); // ✅ send the input
    return res.status(200).send('Input sent');
  }
  return res.status(400).send('No active process');
});






// === CRUD Routes ===
app.get("/programs", async (req, res) => {
  const { language } = req.query;
  const filter = language ? { "codes.language": language } : {};

  try {
    const programs = await Program.find(filter);
    res.json(programs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch programs" });
  }
});

app.post("/programs", async (req, res) => {
  try {
    const newProgram = new Program(req.body);
    await newProgram.save();
    res.status(201).json(newProgram);
  } catch (err) {
    res.status(400).json({ error: "Failed to add program", details: err.message });
  }
});

app.put("/programs/:id", async (req, res) => {
  try {
    const updatedProgram = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProgram);
  } catch (err) {
    res.status(400).json({ error: "Failed to update program" });
  }
});

app.delete("/programs/:id", async (req, res) => {
  try {
    await Program.findByIdAndDelete(req.params.id);
    res.json({ message: "Program deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete program" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});