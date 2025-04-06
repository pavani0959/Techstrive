import React, { useState } from "react";
import axios from "axios";

const UploadNotes = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [evaluation, setEvaluation] = useState("");
  const [message, setMessage] = useState("");
  const [assignmentId, setAssignmentId] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("notes", file);
    formData.append("studentId", "12345"); // Replace with actual student ID

    try {
      setUploading(true);
      setMessage("");
      setEvaluation("");

      const res = await axios.post("http://localhost:5000/upload-notes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message);
      setEvaluation(res.data.evaluation);
      setAssignmentId(res.data.assignmentId);
    } catch (error) {
      setMessage("Upload failed. Please try again.");
      console.error("Upload Error:", error);
    } finally {
      setUploading(false);
    }
  };

  const requestTeacherReview = async () => {
    try {
      await axios.post("http://localhost:5000/request-teacher-review", { assignmentId });
      setMessage("Teacher review requested successfully.");
    } catch (error) {
      setMessage("Failed to request review.");
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Submit Handwritten Notes</h3>
      <input type="file" className="form-control" onChange={handleFileChange} />
      <button className="btn btn-primary mt-2" onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {evaluation && (
        <div className="mt-3">
          <h5>AI Evaluation:</h5>
          <p>{evaluation}</p>
          <button className="btn btn-secondary" onClick={requestTeacherReview}>
            Request Teacher Review
          </button>
        </div>
      )}

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default UploadNotes;
