import React, { useState } from "react";
import UploadQuiz from "./UploadQuiz";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

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
    <div className="d-flex justify-content-center align-items-center vh-100">
      {activeSection === "dashboard" ? (
        // ** Main Dashboard**
        <div className="card shadow-lg p-4 text-center" style={{ width: "400px", borderRadius: "15px" }}>
          <h2 className="mb-4 fw-bold">📚 Teacher Dashboard</h2>

          <div className="d-grid gap-3">
            {/* Upload Quiz */}
            <button className="btn btn-outline-primary py-2 fw-semibold" onClick={() => setActiveSection("uploadQuiz")}>
              Upload Quiz
            </button>

            {/* Check Student Results */}
            <button className="btn btn-outline-success py-2 fw-semibold">Check Student Results</button>

            {/* Check Assignments */}
            <button className="btn btn-outline-warning py-2 fw-semibold">Check Assignments</button>

            {/* Reply to Doubts */}
            <button className="btn btn-outline-info py-2 fw-semibold">Reply to Doubts</button>

            {/* Give Feedback */}
            <button className="btn btn-outline-dark py-2 fw-semibold">Give Feedback</button>

            {/* Upload Notes */}
            <button className="btn btn-outline-secondary py-2 fw-semibold">Upload Notes</button>

            {/* Upload Assignment */}
            <button className="btn btn-outline-danger py-2 fw-semibold" onClick={() => setActiveSection("uploadAssignment")}>
              Upload Assignment
            </button>
          </div>
        </div>
      ) : (
        // ** Show Active Section**
        <div className="card shadow-lg p-4 text-center" style={{ width: "500px", borderRadius: "15px" }}>
          <button className="btn btn-secondary mb-3" onClick={() => setActiveSection("dashboard")}>
            ⬅ Back to Dashboard
          </button>

          {/* Show Components Based on User Selection */}
          {activeSection === "uploadQuiz" && <UploadQuiz />}

          {activeSection === "uploadAssignment" && (
            <div>
              <h4 className="mb-3">Upload Assignment</h4>
              <input type="file" onChange={handleFileChange} className="form-control mb-3" />
              <button className="btn btn-primary w-100" onClick={handleUpload} disabled={uploading}>
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
