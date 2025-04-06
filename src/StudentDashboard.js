import React, { useState } from "react";
import ChatBoard from "./chatboard";
import AssignmentUpload from "./UploadAssignment";
import UploadNotes from "./UploadNotes";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StudentDashboard.css"; // Import CSS file

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="dashboard-container">
      {activeSection === "dashboard" ? (
        <div className="dashboard-card">
          <h2 className="dashboard-title">Student Dashboard</h2>

          <div className="dashboard-grid">
            <button className="dashboard-btn">Take Quiz</button>
            <button className="dashboard-btn">View Quiz Results</button>
            <button 
              className="dashboard-btn" 
              onClick={() => setActiveSection("uploadAssignment")}
            >
              Submit Assignment
            </button>
            <button className="dashboard-btn">View Progress</button>
            <button 
              className="dashboard-btn" 
              onClick={() => setActiveSection("uploadNotes")}
            >
              Submit Handwritten Notes
            </button>
            <button 
              className="dashboard-btn" 
              onClick={() => setActiveSection("chat")}
            >
              Ask Doubt
            </button>
            <button className="dashboard-btn">Give Feedback</button>
          </div>
        </div>
      ) : (
        <div className="dashboard-card">
          <button className="back-btn" onClick={() => setActiveSection("dashboard")}>
            ⬅ Back to Dashboard
          </button>
          {activeSection === "chat" && <ChatBoard />}
          {activeSection === "uploadAssignment" && <AssignmentUpload />}
          {activeSection === "uploadNotes" && <UploadNotes />}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
