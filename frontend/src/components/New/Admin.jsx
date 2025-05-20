import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const AdminPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [title, setTitle] = useState("");
  const [codes, setCodes] = useState([{ language: "Python", solution: "" }]);
  const [testCases, setTestCases] = useState([{ input: "", expectedOutput: "" }]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await fetch("http://localhost:5000/programs");
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched Programs:", data); // for debugging
        setPrograms(data); // Assuming you're using useState
      } else {
        console.error("Failed to fetch programs");
      }
    } catch (error) {
      console.error("Error fetching programs", error);
    }
  };


  const resetForm = () => {
    setTitle("");
    setCodes([{ language: "Python", solution: "" }]);
    setTestCases([{ input: "", expectedOutput: "" }]);
    setEditId(null);
  };

  const handleAddCode = () => {
    setCodes([...codes, { language: "Python", solution: "" }]);
  };

  const handleRemoveCode = (index) => {
    if (codes.length === 1) return;
    const updated = codes.filter((_, i) => i !== index);
    setCodes(updated);
  };

  const handleCodeChange = (index, field, value) => {
    const updated = [...codes];
    updated[index][field] = value;
    setCodes(updated);
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: "", expectedOutput: "" }]);
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const handleSaveProgram = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    const payload = {
      title,
      codes,
      testCases,
    };

    try {
      let res;
      if (editId) {
        res = await fetch(`http://localhost:5000/programs/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("http://localhost:5000/programs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        await fetchPrograms(); // assuming this re-fetches the list
        resetForm();
      } else {
        alert("Failed to save program");
      }
    } catch (error) {
      console.error("Error saving program", error);
    }
  };

  const handleEdit = (program) => {
    setEditId(program._id);
    setTitle(program.title);
    setCodes(program.codes.length ? program.codes : [{ language: "Python", solution: "" }]);
    setTestCases(program.testCases.length ? program.testCases : [{ input: "", expectedOutput: "" }]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    try {
      const res = await fetch(`/api/admin/programs/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchPrograms();
      } else {
        alert("Failed to delete program");
      }
    } catch (error) {
      console.error("Error deleting program", error);
    }
  };

  return (
    <Grid container spacing={3} padding={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          {editId ? "Edit Program" : "Add New Program"}
        </Typography>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />

        {codes.map((code, index) => (
          <Box key={index} mb={2}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Language</InputLabel>
              <Select
                value={code.language}
                onChange={(e) =>
                  handleCodeChange(index, "language", e.target.value)
                }
                fullWidth
              >
                <MenuItem value="Python">Python</MenuItem>
                <MenuItem value="JavaScript">JavaScript</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Solution"
              multiline
              rows={4}
              value={code.solution}
              onChange={(e) =>
                handleCodeChange(index, "solution", e.target.value)
              }
              margin="normal"
            />
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemoveCode(index)}
              disabled={codes.length === 1}
            >
              Remove Code Block
            </Button>
          </Box>
        ))}

        <Button
          variant="outlined"
          onClick={handleAddCode}
          style={{ marginBottom: "20px" }}
        >
          Add Code Block
        </Button>

        <Typography variant="h6" gutterBottom>
          Test Cases
        </Typography>

        {testCases.map((testCase, index) => (
          <Box key={index} mb={2}>
            <TextField
              fullWidth
              label="Input"
              value={testCase.input}
              onChange={(e) =>
                handleTestCaseChange(index, "input", e.target.value)
              }
              margin="normal"
              multiline
              rows={4} // You can adjust number of visible lines
            />
            <TextField
              fullWidth
              label="Expected Output"
              value={testCase.expectedOutput}
              onChange={(e) =>
                handleTestCaseChange(index, "expectedOutput", e.target.value)
              }
              margin="normal"
              multiline // Optional: only if you want output to be multi-line too
              rows={2}
            />
          </Box>
        ))}

        <Button
          variant="outlined"
          onClick={handleAddTestCase}
          style={{ marginBottom: "20px" }}
        >
          Add Test Case
        </Button>

        <Box display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={handleSaveProgram}>
            {editId ? "Update Program" : "Save Program"}
          </Button>
          <Button variant="outlined" onClick={resetForm}>
            Clear
          </Button>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Existing Programs
        </Typography>
        {programs.map((program) => (
          <Box
            key={program._id}
            border={1}
            borderRadius={4}
            p={2}
            mb={2}
            borderColor="grey.300"
          >
            <Typography variant="h6">{program.title}</Typography>
            {program.codes.map((code, i) => (
              <Box key={i} ml={2} mb={1}>
                <Typography variant="subtitle2">Language: {code.language}</Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {code.solution}
                </Typography>
              </Box>
            ))}
            <Box display="flex" gap={2} mt={2}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleEdit(program)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(program._id)}
              >
                Delete
              </Button>
            </Box>
          </Box>
        ))}
      </Grid>
    </Grid>
  );
};

export default AdminPrograms;
