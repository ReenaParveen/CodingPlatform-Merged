// const express = require("express");
// const cors = require("cors");
// const axios = require("axios");

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// app.post("/run", async (req, res) => {
//     const { code, input, language } = req.body;
  
//     // Default to python3 if no language is specified
//     const selectedLanguage = language === "python2" ? "python2" : "python3";
//     const version = selectedLanguage === "python2" ? "2.7.18" : "3.10.0"; // Adjust versions based on Piston API support
  
//     try {
//       const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
//         language: selectedLanguage,
//         version: version,
//         files: [
//           {
//             name: "main.py",
//             content: code,
//           },
//         ],
//         stdin: input || "",
//       });
  
//       res.json({ output: response.data.run.output });
//     } catch (error) {
//       console.error("Execution error:", error.message || error);
//       res.status(500).json({ output: "Server Error: Unable to execute code." });
//     }
//   });  

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/codePlatform", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Define Program Schema
const programSchema = new mongoose.Schema({
  title: String,
  code: String,
  testCases: [
    {
      input: String,
      expectedOutput: String,
    },
  ],
});

const Program = mongoose.model("Program", programSchema);

// Code Execution Route 
app.post("/run", async (req, res) => {
  const { code, input, language } = req.body;

  const selectedLanguage = language === "python2" ? "python2" : "python3";
  const version = selectedLanguage === "python2" ? "2.7.18" : "3.10.0";

  try {
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language: selectedLanguage,
      version,
      files: [{ name: "main.py", content: code }],
      stdin: input || "",
    });

    res.json({ output: response.data.run.output });
  } catch (error) {
    console.error("Execution error:", error.message || error);
    res.status(500).json({ output: "Server Error: Unable to execute code." });
  }
});


// === New Routes for Programs ===

// Get all programs
app.get("/programs", async (req, res) => {
  try {
    const programs = await Program.find();
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
    res.status(400).json({ error: "Failed to add program" });
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
