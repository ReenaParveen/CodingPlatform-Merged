import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../src/components/New/Dashboard";
import Ui from "../src/components/New/Ui";
import Admin from "../src/components/New/Admin";

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