import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard"
import Ui from "./Components/Ui";
import Admin from "./Components/Admin";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/code" element={<Ui />} />
        <Route path="/add" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;