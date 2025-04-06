import React, { useState } from "react";
import UploadQuiz from "./UploadQuiz";
import axios from "axios";
import "./TeacherDashboard.css";

const TeacherDashboard = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a file!");
      return;
    }
    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("assignment", file);

    try {
      const response = await axios.post("http://localhost:5000/upload-assignment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(`✅ Uploaded successfully! View: ${response.data.link}`);
    } catch (error) {
      setMessage("❌ Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="teacher-dashboard-container">
      {activeSection === "dashboard" ? (
        <div className="teacher-dashboard-card">
          <h2 className="teacher-dashboard-title">📚 Teacher Dashboard</h2>

          <div className="teacher-dashboard-grid">
            <button className="dashboard-btn" onClick={() => setActiveSection("uploadQuiz")}>
              Upload Quiz
            </button>
            <button className="dashboard-btn">Check Student Results</button>
            <button className="dashboard-btn">Check Assignments</button>
            <button className="dashboard-btn">Reply to Doubts</button>
            <button className="dashboard-btn">Give Feedback</button>
            <button className="dashboard-btn">Upload Notes</button>
            <button className="dashboard-btn" onClick={() => setActiveSection("uploadAssignment")}>
              Upload Assignment
            </button>
          </div>
        </div>
      ) : (
        <div className="teacher-dashboard-card">
          <button className="back-btn" onClick={() => setActiveSection("dashboard")}>
            ⬅ Back to Dashboard
          </button>

          {activeSection === "uploadQuiz" && <UploadQuiz />}

          {activeSection === "uploadAssignment" && (
            <div>
              <h4 className="mb-3">Upload Assignment</h4>
              <input type="file" onChange={handleFileChange} className="form-control mb-3" />
              <button className="dashboard-btn" onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
              </button>
              {message && <p className="mt-3">{message}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
