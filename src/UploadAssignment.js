import React, { useState } from "react";
import axios from "axios";

const AssignmentUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("assignment", file);
    formData.append("studentId", "12345"); // Replace with actual student ID

    try {
      setUploading(true);
      setMessage("");

      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });

      setMessage("Upload Successful!");
    } catch (error) {
      setMessage("Upload failed. Please try again.");
      console.error("Upload Error:", error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Submit Assignment</h3>
      <input type="file" className="form-control" onChange={handleFileChange} />
      
      {file && <p className="mt-2 text-muted">File: {file.name}</p>}

      <button className="btn btn-primary mt-2" onClick={handleUpload} disabled={uploading}>
        {uploading ? `Uploading... ${progress}%` : "Upload"}
      </button>

      {progress > 0 && (
        <div className="progress mt-2">
          <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {message && <p className={`mt-3 ${message.includes("failed") ? "text-danger" : "text-success"}`}>{message}</p>}
    </div>
  );
};

export default AssignmentUpload;
