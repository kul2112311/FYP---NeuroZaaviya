import React, { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission (without backend interaction)
  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // For demonstration, simulate a login success/failure
    if (email === "user@example.com" && password === "password123") {
      onLogin(); // Call the onLogin prop to indicate successful login
    } else {
      setError("Wrong email or password");
    }
  }

  return (
    <div className="login-container">
      {/* Logo and Title */}
      <div className="logo-container">
        <img
          src="/images/NZ_logo.png"
          alt="Neurozaaviya Logo"
          className="logo"
        />
        <h1 className="title">Neurozaaviya</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          placeholder="Email / Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
