const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const codeService = require('./Services/codeService')

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/codePlatform", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
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
app.post("/run", async (req, res) => {
  const { code, input, language } = req.body;

  console.log("📥 Code Run Request:", { language, input });

  try {
    let output;

    if (language === "Python") {
      console.log("python code exceuted");
      output = await codeService.compileAndRunPythonCode(code, input || '');
      console.log(output);
    } else if (language === "JavaScript") {
      console.log("javascript code exceuted");
      output = await codeService.executeJavaScriptCode(code);
      console.log(output);
    } else if (language === "Java") {
      console.log("Java code exceuted");
      output = await codeService.compileAndRunCode(code, input || '');
      console.log(output);
    } else {
      return res.status(400).json({ output: `Language '${language}' not supported.` });
    }

    res.json({ output: output.trim() });
  } catch (err) {
    console.error("🔥 BACKEND ERROR:", err);
    res.status(500).json({ output: err.message || "Server Error" });
  }
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