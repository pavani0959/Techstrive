import React, { useState } from "react";
import axios from "axios";

const UploadQuiz = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [quiz, setQuiz] = useState(null);
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
    formData.append("file", file);

    try {
      setUploading(true);
      setMessage("");

      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setQuiz(res.data.quiz);
      setMessage("Quiz generated successfully!");
    } catch (error) {
      setMessage("Upload failed. Please try again.");
      console.error("Upload Error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Upload Study Material to Generate Quiz</h3>
      <input type="file" className="form-control" onChange={handleFileChange} />
      <button className="btn btn-primary mt-2" onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload & Generate Quiz"}
      </button>

      {message && <p className="mt-3">{message}</p>}

      {/* Display Generated Quiz */}
      {quiz && (
        <div className="mt-4">
          <h4>Generated Quiz: {quiz.title}</h4>
          <ul>
            {quiz.questions.map((q, index) => (
              <li key={index}>
                <strong>Q{index + 1}:</strong> {q}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadQuiz;
