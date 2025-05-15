// import React, { useState } from 'react';
// import { TextField, Button, Grid } from '@mui/material';
// import axios from 'axios';

// const AddProgram = () => {
//   const [title, setTitle] = useState('');
//   const [code, setCode] = useState('');
//   const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '' }]);

//   const handleAddTestCase = () => {
//     setTestCases([...testCases, { input: '', expectedOutput: '' }]);
//   };

//   const handleSaveProgram = () => {
//     const programData = {
//       title,
//       code,
//       testCases
//     };

//     axios.post('/api/add-program', programData)
//       .then(response => {
//         console.log('Program added:', response.data);
//       })
//       .catch(error => console.error('Error adding program:', error));
//   };

//   return (
//     <Grid container spacing={2}>
//       <Grid item xs={12}>
//         <TextField label="Program Title" fullWidth value={title} onChange={e => setTitle(e.target.value)} />
//       </Grid>
//       <Grid item xs={12}>
//         <TextField label="Code" fullWidth multiline rows={4} value={code} onChange={e => setCode(e.target.value)} />
//       </Grid>
//       {testCases.map((testCase, index) => (
//         <Grid container spacing={2} key={index}>
//           <Grid item xs={6}>
//             <TextField label={`Test Case Input ${index + 1}`} fullWidth value={testCase.input} onChange={e => {
//               const updatedTestCases = [...testCases];
//               updatedTestCases[index].input = e.target.value;
//               setTestCases(updatedTestCases);
//             }} />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField label={`Test Case Output ${index + 1}`} fullWidth value={testCase.expectedOutput} onChange={e => {
//               const updatedTestCases = [...testCases];
//               updatedTestCases[index].expectedOutput = e.target.value;
//               setTestCases(updatedTestCases);
//             }} />
//           </Grid>
//         </Grid>
//       ))}
//       <Grid item xs={12}>
//         <Button variant="outlined" onClick={handleAddTestCase}>Add Test Case</Button>
//       </Grid>
//       <Grid item xs={12}>
//         <Button variant="contained" onClick={handleSaveProgram}>Save Program</Button>
//       </Grid>
//     </Grid>
//   );
// };

// export default AddProgram;

import React, { useState } from 'react';
import { TextField, Button, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const AddProgram = () => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '' }]);
  const [selectedProgram, setSelectedProgram] = useState(''); // Track the selected program
  const [programs] = useState([
    'Program 1', 'Program 2', 'Program 3' // List of programs (can be dynamic from your backend)
  ]);

  // Handle the program selection change
  const handleProgramChange = (e) => {
    setSelectedProgram(e.target.value);
    // When the program is selected, you can format test cases accordingly
    formatTestCasesForProgram(e.target.value);
  };

  // Format test cases based on selected program
  const formatTestCasesForProgram = (program) => {
    if (program === 'Program 1') {
      // Adjust the test case format for Program 1
      setTestCases([{ input: '', expectedOutput: '' }]); // Example: Reset format for Program 1
    } else if (program === 'Program 2') {
      // Adjust for Program 2
      setTestCases([{ input: '', expectedOutput: '', additionalField: '' }]); // Example: Extra field for Program 2
    }
    // Add more conditional logic for other programs
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '' }]);
  };

  const handleSaveProgram = () => {
    // Ensure test case data is correctly formatted based on selected program
    const programData = {
      title,
      code,
      testCases
    };

    // Submit the formatted data to the backend
    axios.post('/api/add-program', programData)
      .then(response => {
        console.log('Program added:', response.data);
      })
      .catch(error => console.error('Error adding program:', error));
  };

  return (
    <Grid container spacing={2}>
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
          rows={4}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </Grid>

      {/* Program Dropdown */}
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Program</InputLabel>
          <Select
            value={selectedProgram}
            onChange={handleProgramChange}
            label="Program"
          >
            {programs.map((program, index) => (
              <MenuItem key={index} value={program}>{program}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Test Case Fields */}
      {testCases.map((testCase, index) => (
        <Grid container spacing={2} key={index}>
          <Grid item xs={6}>
            <TextField
              label={`Test Case Input ${index + 1}`}
              fullWidth
              value={testCase.input}
              onChange={(e) => {
                const updatedTestCases = [...testCases];
                updatedTestCases[index].input = e.target.value;
                setTestCases(updatedTestCases);
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label={`Test Case Output ${index + 1}`}
              fullWidth
              value={testCase.expectedOutput}
              onChange={(e) => {
                const updatedTestCases = [...testCases];
                updatedTestCases[index].expectedOutput = e.target.value;
                setTestCases(updatedTestCases);
              }}
            />
          </Grid>
          {/* Add more fields if necessary based on the selected program */}
          {selectedProgram === 'Program 2' && (
            <Grid item xs={12}>
              <TextField
                label={`Additional Field for Test Case ${index + 1}`}
                fullWidth
                value={testCase.additionalField || ''}
                onChange={(e) => {
                  const updatedTestCases = [...testCases];
                  updatedTestCases[index].additionalField = e.target.value;
                  setTestCases(updatedTestCases);
                }}
              />
            </Grid>
          )}
        </Grid>
      ))}
      
      <Grid item xs={12}>
        <Button variant="outlined" onClick={handleAddTestCase}>Add Test Case</Button>
      </Grid>
      
      <Grid item xs={12}>
        <Button variant="contained" onClick={handleSaveProgram}>Save Program</Button>
      </Grid>
    </Grid>
  );
};

export default AddProgram;
