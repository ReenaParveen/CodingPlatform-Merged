import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import axios from 'axios';

const AdminDashboard = () => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    axios.get('/api/programs')
      .then(response => {
        setPrograms(response.data);
      })
      .catch(error => console.error('Error fetching programs:', error));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`/api/delete-program/${id}`)
      .then(() => {
        setPrograms(programs.filter(program => program._id !== id));
      })
      .catch(error => console.error('Error deleting program:', error));
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {programs.map(program => (
            <TableRow key={program._id}>
              <TableCell>{program.title}</TableCell>
              <TableCell>{program.code.slice(0, 50)}...</TableCell>
              <TableCell>
                <Button variant="contained" color="primary">Edit</Button>
                <Button variant="contained" color="secondary" onClick={() => handleDelete(program._id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminDashboard;
