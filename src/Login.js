import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email.endsWith("@iiitl.ac.in")) {
      navigate("/student-dashboard");
    } else if (email.endsWith("@tiiitl.ac.in")) {
      navigate("/teacher-dashboard");
    } else {
      setError("Invalid email or password!");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(to right, #0F2027, #203A43, #2C5364)",
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "15px",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <h2 className="text-center mb-3 text-light fw-bold">
          Welcome Back
        </h2>
        <p className="text-center text-light" style={{ fontSize: "14px" }}>
          Simplifying your workflow, empowering education.
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-light fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "white",
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-light fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "white",
              }}
            />
          </div>
          {error && <p className="text-danger text-center">{error}</p>}
          <button
            type="submit"
            className="btn btn-light w-100"
            style={{
              fontWeight: "bold",
              background: "rgba(255, 255, 255, 0.8)",
              color: "#203A43",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
