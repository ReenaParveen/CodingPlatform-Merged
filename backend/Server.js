const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/codePlatform", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("✅ Connected to MongoDB"));

// Define Schema and Model
const programSchema = new mongoose.Schema({
  title: { type: String, required: true },
  codes: [
    {
      language: {
        type: String,
        enum: ["Python", "JavaScript"],
        required: true,
      },
      solution: { type: String, required: true },
    }
  ],
  testCases: [
    {
      input: String,
      expectedOutput: String,
    },
  ],
});

const Program = mongoose.model("Program", programSchema);

// === Code Execution Route ===
app.post("/run", async (req, res) => {
  const { code, input, language } = req.body;

  let selectedLanguage, version;

  if (language === "Python") {
    selectedLanguage = "python3";
    version = "3.10.0";
  } else if (language === "JavaScript") {
    selectedLanguage = "javascript";
    version = "18.15.0";
  } else {
    return res.status(400).json({ output: `Language '${language}' not supported.` });
  }

  try {
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language: selectedLanguage,
      version,
      files: [{ name: "main", content: code }],
      stdin: input || "",
    });

    res.json({ output: response.data.run.output });
  } catch (error) {
    console.error("Execution error:", error.message || error);
    res.status(500).json({ output: "Server Error: Unable to execute code." });
  }
});

// === CRUD Routes ===
 
// Get all programs OR filter by language
app.get("/programs", async (req, res) => {
  const { language } = req.query;

  let filter = {};
  if (language) {
    filter = {
      "codes.language": language,
    };
  }

  try {
    const programs = await Program.find(filter);
    res.json(programs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch programs" });
  }
});

// Add new program
app.post("/programs", async (req, res) => {
  try {
    const newProgram = new Program(req.body);
    await newProgram.save();
    res.status(201).json(newProgram);
  } catch (err) {
    res.status(400).json({ error: "Failed to add program", details: err.message });
  }
});

// Update a program
app.put("/programs/:id", async (req, res) => {
  try {
    const updatedProgram = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProgram);
  } catch (err) {
    res.status(400).json({ error: "Failed to update program" });
  }
});

// Delete a program
app.delete("/programs/:id", async (req, res) => {
  try {
    await Program.findByIdAndDelete(req.params.id);
    res.json({ message: "Program deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete program" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
