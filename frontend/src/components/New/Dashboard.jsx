import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-fullscreen">
      <h1 className="dashboard-title">Welcome to Code Platform</h1>
      <div className="dashboard-modules">
        <div className="module-card" onClick={() => navigate("/code")}>
          🖊️ Write Code
        </div>
        <div className="module-card" onClick={() => navigate("/add")}>
          ➕ Add Programs
        </div>
      </div>
    </div>
  );
};

export default Dashboard;