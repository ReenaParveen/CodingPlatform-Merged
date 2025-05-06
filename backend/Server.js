const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// app.post("/run", async (req, res) => {
//   const { code, input } = req.body;

//   try {
//       const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
//           language: "python3",
//           version: "3.10.0",
//           files: [
//               {
//                   name: "main.py",
//                   content: code,
//               }
//           ],
//           stdin: input || ""  // If no input, ensure it doesn’t break
//       });

//       res.json({ output: response.data.run.output });
//   } catch (error) {
//       console.error("Execution error:", error.message || error);
//       res.status(500).json({ output: "Server Error: Unable to execute code." });
//   }
// });

app.post("/run", async (req, res) => {
    const { code, input, language } = req.body;
  
    // Default to python3 if no language is specified
    const selectedLanguage = language === "python2" ? "python2" : "python3";
    const version = selectedLanguage === "python2" ? "2.7.18" : "3.10.0"; // Adjust versions based on Piston API support
  
    try {
      const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language: selectedLanguage,
        version: version,
        files: [
          {
            name: "main.py",
            content: code,
          },
        ],
        stdin: input || "",
      });
  
      res.json({ output: response.data.run.output });
    } catch (error) {
      console.error("Execution error:", error.message || error);
      res.status(500).json({ output: "Server Error: Unable to execute code." });
    }
  });  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
