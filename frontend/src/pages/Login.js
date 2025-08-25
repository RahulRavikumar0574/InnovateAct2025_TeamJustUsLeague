import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    // Store role if needed
    localStorage.setItem("role", role);
    navigate("/dashboard");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Select Login</h1>
      <button onClick={() => handleLogin("admin")}>Admin Portal</button>
      <button onClick={() => handleLogin("supervisor")}>Supervisor Portal</button>
    </div>
  );
}

export default Login;
