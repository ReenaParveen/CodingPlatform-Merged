import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Paper,
} from "@mui/material";

const AdminPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [title, setTitle] = useState("");
  const [codes, setCodes] = useState([{ language: "Python", solution: "" }]);
  const [testCases, setTestCases] = useState([{ input: "", expectedOutput: "" }]);
  const [editId, setEditId] = useState(null);
  const [showCodeInput, setShowCodeInput] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await fetch("http://localhost:5000/programs");
      if (res.ok) {
        const data = await res.json();
        setPrograms(data);
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
    setShowCodeInput(true);
  };

  const handleCodeChange = (index, field, value) => {
    const updated = [...codes];
    updated[index][field] = value;
    setCodes(updated);
  };

  const handleAddCodeBlock = () => {
    setCodes([...codes, { language: "Python", solution: "" }]);
  };

  const handleRemoveCodeBlock = (index) => {
    const updated = [...codes];
    updated.splice(index, 1);
    setCodes(updated);
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: "", expectedOutput: "" }]);
  };

  const handleRemoveTestCase = (index) => {
    const updated = [...testCases];
    updated.splice(index, 1);
    setTestCases(updated);
  };

  const handleSaveProgram = async () => {
    if (codes.some(code => !code.language || !code.solution.trim())) {
      alert("Please fill in all code blocks completely.");
      return;
    }

    const payload = { title, codes, testCases };

    try {
      const url = editId
        ? `http://localhost:5000/programs/${editId}`
        : "http://localhost:5000/programs";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchPrograms();
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
    setShowCodeInput(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    try {
      const res = await fetch(`http://localhost:5000/programs/${id}`, {
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
    <Grid container spacing={4} padding={4} sx={{ backgroundColor: "#fff8f8", minHeight: "100vh" }}>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight={700} color="#f06161">
            {editId ? "Edit Program" : "Add New Program"}
          </Typography>
          <Button
            onClick={() => navigate("/")}
            variant="outlined"
            sx={{
              borderColor: "#f06161",
              color: "#f06161",
              "&:hover": { backgroundColor: "#f0616166" },
            }}
          >
            ⬅ Back
          </Button>
        </Box>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2} color="#f06161">
            Program Title
          </Typography>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />

          {showCodeInput && (
            <>
              <Paper
                elevation={1}
                sx={{ p: 2, mt: 2, mb: 2, border: "1px dashed #f06161", borderRadius: 2 }}
              >
                <Typography variant="h6" fontWeight={600} mb={1} color="#f06161">
                  Code Blocks
                </Typography>

                {codes.map((code, index) => (
                  <Paper
                    key={index}
                    elevation={1}
                    sx={{ p: 2, mb: 2, border: "1px dashed #f06161", borderRadius: 2 }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" color="#f06161" mb={1}>
                        Code Block #{index + 1}
                      </Typography>
                      {codes.length > 1 && (
                        <Button color="error" onClick={() => handleRemoveCodeBlock(index)}>
                          ❌ Remove
                        </Button>
                      )}
                    </Box>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={code.language}
                        onChange={(e) => handleCodeChange(index, "language", e.target.value)}
                        fullWidth
                      >
                        <MenuItem value="Python">Python</MenuItem>
                        <MenuItem value="JavaScript">JavaScript</MenuItem>
                        <MenuItem value="C">C</MenuItem>
                        <MenuItem value="Java">Java</MenuItem>
                        <MenuItem value="C++">C++</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Solution"
                      multiline
                      rows={4}
                      value={code.solution}
                      onChange={(e) => handleCodeChange(index, "solution", e.target.value)}
                      margin="normal"
                    />
                  </Paper>
                ))}

                <Button
                  variant="outlined"
                  onClick={handleAddCodeBlock}
                  sx={{
                    borderColor: "#f06161",
                    color: "#f06161",
                    mb: 3,
                    "&:hover": { backgroundColor: "#f0616166" },
                  }}
                >
                  ➕ Add Code Block
                </Button>

                <Typography variant="h6" fontWeight={600} mb={1} color="#f06161">
                  Test Cases
                </Typography>

                {testCases.map((testCase, index) => (
                  <Paper
                    key={index}
                    elevation={1}
                    sx={{ p: 2, mb: 2, border: "1px dashed #f06161", borderRadius: 2 }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" color="#f06161" mb={1}>
                        Test Case #{index + 1}
                      </Typography>
                      {testCases.length > 1 && (
                        <Button color="error" onClick={() => handleRemoveTestCase(index)}>
                          ❌ Remove
                        </Button>
                      )}
                    </Box>
                    <TextField
                      fullWidth
                      label="Input"
                      multiline
                      rows={3}
                      value={testCase.input}
                      onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Expected Output"
                      multiline
                      rows={2}
                      value={testCase.expectedOutput}
                      onChange={(e) =>
                        handleTestCaseChange(index, "expectedOutput", e.target.value)
                      }
                      margin="normal"
                    />
                  </Paper>
                ))}

                <Button
                  variant="outlined"
                  onClick={handleAddTestCase}
                  sx={{
                    borderColor: "#f06161",
                    color: "#f06161",
                    mb: 3,
                    "&:hover": { backgroundColor: "#f0616166" },
                  }}
                >
                  ➕ Add Test Case
                </Button>

                <Box display="flex" gap={2} mt={2}>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#f06161", "&:hover": { backgroundColor: "#e24f4f" } }}
                    onClick={handleSaveProgram}
                  >
                    {editId ? "Update Program" : "Save Program"}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={resetForm}
                    sx={{
                      borderColor: "#f06161",
                      color: "#f06161",
                      "&:hover": { backgroundColor: "#f0616166" },
                    }}
                  >
                    Clear
                  </Button>
                </Box>
              </Paper>
            </>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h5" fontWeight={700} color="#f06161" mb={2}>
          Existing Programs
        </Typography>
        {programs.map((program) => (
          <Paper
            key={program._id}
            elevation={3}
            sx={{ p: 2, mb: 3, borderRadius: 3, backgroundColor: "#fff4f4" }}
          >
            <Typography variant="h6" fontWeight={600} color="#f06161">
              {program.title}
            </Typography>
            {program.codes.map((code, i) => (
              <Box key={i} ml={2} mt={1}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Language: {code.language}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {code.solution}
                </Typography>
              </Box>
            ))}
            <Box display="flex" gap={2} mt={2}>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#f06161",
                  color: "#f06161",
                  "&:hover": { backgroundColor: "#f0616166" },
                }}
                onClick={() => handleEdit(program)}
              >
                Edit
              </Button>
              <Button variant="outlined" color="error" onClick={() => handleDelete(program._id)}>
                Delete
              </Button>
            </Box>
          </Paper>
        ))}
      </Grid>
    </Grid>
  );
};

export default AdminPrograms;