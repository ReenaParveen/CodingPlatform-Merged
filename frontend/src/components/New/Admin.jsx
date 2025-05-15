// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Admin.css"

// const AdminPrograms = () => {
//   const [programs, setPrograms] = useState([]);
//   const [title, setTitle] = useState("");
//   const [code, setCode] = useState("");
//   const [testCases, setTestCases] = useState([{ input: "", expectedOutput: "" }]);
//   const [editId, setEditId] = useState(null);

//   const API_BASE = "http://localhost:5000";

//   // Fetch all programs
//   useEffect(() => {
//     fetchPrograms();
//   }, []);

//   const fetchPrograms = async () => {
//     const res = await axios.get(`${API_BASE}/programs`);
//     setPrograms(res.data);
//   };

//   const handleAddOrUpdate = async () => {
//     const payload = { title, code, testCases };
//     if (editId) {
//       await axios.put(`${API_BASE}/programs/${editId}`, payload);
//       setEditId(null);
//     } else {
//       await axios.post(`${API_BASE}/programs`, payload);
//     }
//     resetForm();
//     fetchPrograms();
//   };

//   const resetForm = () => {
//     setTitle("");
//     setCode("");
//     setTestCases([{ input: "", expectedOutput: "" }]);
//     setEditId(null);
//   };

//   const handleDelete = async (id) => {
//     await axios.delete(`${API_BASE}/programs/${id}`);
//     fetchPrograms();
//   };

//   const handleEdit = (program) => {
//     setTitle(program.title);
//     setCode(program.code);
//     setTestCases(program.testCases);
//     setEditId(program._id);
//   };

//   const handleTestCaseChange = (index, field, value) => {
//     const updated = [...testCases];
//     updated[index][field] = value;
//     setTestCases(updated);
//   };

//   const addTestCase = () => {
//     setTestCases([...testCases, { input: "", expectedOutput: "" }]);
//   };

//   return (
//     <div className="admin-container" style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
//       <h2>{editId ? "Edit Program" : "Add New Program"}</h2>
//       <input
//         type="text"
//         placeholder="Program Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         style={{ width: "100%", marginBottom: "10px" }}
//       />
//       <textarea
//         placeholder="Code"
//         value={code}
//         onChange={(e) => setCode(e.target.value)}
//         rows={6}
//         style={{ width: "100%", marginBottom: "10px" }}
//       />

//       <h4>Test Cases</h4>
//       {testCases.map((tc, idx) => (
//         <div key={idx} style={{ marginBottom: "10px" }}>
//           <input
//             type="text"
//             placeholder="Input"
//             value={tc.input}
//             onChange={(e) => handleTestCaseChange(idx, "input", e.target.value)}
//             style={{ width: "48%", marginRight: "4%" }}
//           />
//           <input
//             type="text"
//             placeholder="Expected Output"
//             value={tc.expectedOutput}
//             onChange={(e) => handleTestCaseChange(idx, "expectedOutput", e.target.value)}
//             style={{ width: "48%" }}
//           />
//         </div>
//       ))}
//       <button onClick={addTestCase}>➕ Add Test Case</button>
//       <br />
//       <button onClick={handleAddOrUpdate} style={{ marginTop: "15px" }}>
//         {editId ? "Update Program" : "Add Program"}
//       </button>
//       <hr />
//       <h2>Existing Programs</h2>
//       {programs.map((prog) => (
//         <div key={prog._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
//           <h4>{prog.title}</h4>
//           <pre style={{ background: "#f9f9f9", padding: "10px" }}>{prog.code}</pre>
//           <strong>Test Cases:</strong>
//           <ul>
//             {prog.testCases.map((tc, i) => (
//               <li key={i}>
//                 Input: <code>{tc.input}</code> → Output: <code>{tc.expectedOutput}</code>
//               </li>
//             ))}
//           </ul>
//           <button onClick={() => handleEdit(prog)}>✏️ Edit</button>{" "}
//           <button onClick={() => handleDelete(prog._id)}>❌ Delete</button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AdminPrograms;
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AdminPrograms = () => {
//   const [programs, setPrograms] = useState([]);
//   const [title, setTitle] = useState("");
//   const [code, setCode] = useState("");
//   const [testCases, setTestCases] = useState([""]);
//   const [editId, setEditId] = useState(null);

//   const API_BASE = "http://localhost:5000";

//   // Fetch all programs
//   useEffect(() => {
//     fetchPrograms();
//   }, []);

//   const fetchPrograms = async () => {
//     const res = await axios.get(`${API_BASE}/programs`);
//     setPrograms(res.data);
//   };

//   const handleAddOrUpdate = async () => {
//     const payload = { title, code, testCases: testCases.map((tc) => ({ inputOutput: tc })) };
//     if (editId) {
//       await axios.put(`${API_BASE}/programs/${editId}`, payload);
//       setEditId(null);
//     } else {
//       await axios.post(`${API_BASE}/programs`, payload);
//     }
//     resetForm();
//     fetchPrograms();
//   };

//   const resetForm = () => {
//     setTitle("");
//     setCode("");
//     setTestCases([""]);
//     setEditId(null);
//   };

//   const handleDelete = async (id) => {
//     await axios.delete(`${API_BASE}/programs/${id}`);
//     fetchPrograms();
//   };

//   const handleEdit = (program) => {
//     setTitle(program.title);
//     setCode(program.code);
//     setTestCases(program.testCases.map((tc) => tc.inputOutput));
//     setEditId(program._id);
//   };

//   const handleTestCaseChange = (index, value) => {
//     const updated = [...testCases];
//     updated[index] = value;
//     setTestCases(updated);
//   };

//   const addTestCase = () => {
//     setTestCases([...testCases, ""]);
//   };

//   return (
//     <div className="admin-container" style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
//       <h2>{editId ? "Edit Program" : "Add New Program"}</h2>
//       <input
//         type="text"
//         placeholder="Program Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         style={{ width: "100%", marginBottom: "10px" }}
//       />
//       <textarea
//         placeholder="Code"
//         value={code}
//         onChange={(e) => setCode(e.target.value)}
//         rows={6}
//         style={{ width: "100%", marginBottom: "10px" }}
//       />

//       <h4>Test Cases</h4>
//       {testCases.map((tc, idx) => (
//         <div key={idx} style={{ marginBottom: "10px" }}>
//           <textarea
//             placeholder={`Test Case ${idx + 1} (input\nexpectedOutput)`}
//             value={tc}
//             onChange={(e) => handleTestCaseChange(idx, e.target.value)}
//             rows={4}
//             style={{ width: "100%" }}
//           />
//         </div>
//       ))}
//       <button onClick={addTestCase}>➕ Add Test Case</button>
//       <br />
//       <button onClick={handleAddOrUpdate} style={{ marginTop: "15px" }}>
//         {editId ? "Update Program" : "Add Program"}
//       </button>
//       <hr />
//       <h2>Existing Programs</h2>
//       {programs.map((prog) => (
//         <div key={prog._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
//           <h4>{prog.title}</h4>
//           <pre style={{ background: "#f9f9f9", padding: "10px" }}>{prog.code}</pre>
//           <strong>Test Cases:</strong>
//           <ul>
//             {prog.testCases.map((tc, i) => (
//               <li key={i}>
//                 <strong>Test Case {i + 1}:</strong>
//                 <br />
//                 <code>{tc.inputOutput}</code>
//               </li>
//             ))}
//           </ul>
//           <button onClick={() => handleEdit(prog)}>✏️ Edit</button>{" "}
//           <button onClick={() => handleDelete(prog._id)}>❌ Delete</button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AdminPrograms;


import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const AdminPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '' }]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [editId, setEditId] = useState(null);

  const API_BASE = 'http://localhost:5000';

  // Fetch all programs
  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    const res = await axios.get(`${API_BASE}/programs`);
    setPrograms(res.data);
  };

  // Handle program selection change
  const handleProgramChange = (e) => {
    setSelectedProgram(e.target.value);
    formatTestCasesForProgram(e.target.value);
  };

  // Format test cases based on selected program
  const formatTestCasesForProgram = (program) => {
    if (program === 'Program 1') {
      setTestCases([{ input: '', expectedOutput: '' }]);
    } else if (program === 'Program 2') {
      setTestCases([{ input: '', expectedOutput: '', additionalField: '' }]);
    }
    // Add more logic for other programs if needed
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '' }]);
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index][field] = value;
    setTestCases(updatedTestCases);
  };

  const handleSaveProgram = async () => {
    const programData = {
      title,
      code,
      testCases
    };

    try {
      if (editId) {
        await axios.put(`${API_BASE}/programs/${editId}`, programData);
        setEditId(null);
      } else {
        await axios.post(`${API_BASE}/programs`, programData);
      }
      resetForm();
      fetchPrograms();
    } catch (error) {
      console.error('Error saving program:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setCode('');
    setTestCases([{ input: '', expectedOutput: '' }]);
    setSelectedProgram('');
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE}/programs/${id}`);
    fetchPrograms();
  };

  const handleEdit = (program) => {
    setTitle(program.title);
    setCode(program.code);
    setTestCases(program.testCases);
    setEditId(program._id);
    setSelectedProgram(program.title); // Assuming the program title matches the selected program
  };

  return (
    <Grid container spacing={2} style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Grid item xs={12}>
        <TextField
          label="Program Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Code"
          fullWidth
          multiline
          rows={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Program</InputLabel>
          <Select
            value={selectedProgram}
            onChange={handleProgramChange}
            label="Program"
          >
            {programs.map((prog) => (
              <MenuItem key={prog._id} value={prog.title}>
                {prog.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <h4>Test Cases</h4>
        {testCases.map((tc, idx) => (
          <div key={idx} style={{ marginBottom: '10px' }}>
            <TextField
              label={`Test Case ${idx + 1} Input`}
              fullWidth
              multiline
              rows={2}
              value={tc.input}
              onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)}
            />
            <TextField
              label={`Test Case ${idx + 1} Expected Output`}
              fullWidth
              multiline
              rows={2}
              value={tc.expectedOutput}
              onChange={(e) => handleTestCaseChange(idx, 'expectedOutput', e.target.value)}
            />
          </div>
        ))}
        <Button onClick={handleAddTestCase}>➕ Add Test Case</Button>
      </Grid>

      <Grid item xs={12}>
        <Button onClick={handleSaveProgram} variant="contained" color="primary">
          {editId ? 'Update Program' : 'Add Program'}
        </Button>
      </Grid>

      <Grid item xs={12}>
        <hr />
        <h2>Existing Programs</h2>
        {programs.map((prog) => (
          <div key={prog._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h4>{prog.title}</h4>
            <pre style={{ background: '#f9f9f9', padding: '10px' }}>{prog.code}</pre>
            <strong>Test Cases:</strong>
            <ul>
              {prog.testCases.map((tc, i) => (
                <li key={i}>
                  <strong>Test Case {i + 1}:</strong>
                  <br />
                  <code>{tc.input}</code>
                  <br />
                  <code>{tc.expectedOutput}</code>
                </li>
              ))}
            </ul>
            <Button onClick={() => handleEdit(prog)} variant="outlined" color="primary">
              ✏️ Edit
            </Button>
            <Button onClick={() => handleDelete(prog._id)} variant="outlined" color="secondary">
              ❌ Delete
            </Button>
          </div>
        ))}
      </Grid>
    </Grid>
  );
};

export default AdminPrograms;