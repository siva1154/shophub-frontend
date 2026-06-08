import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
  alert("Passwords do not match");
  return;
}
    try {
      await API.post("/auth/register", {
        email,
        password,
      });
navigate("/verify-registration", {
  state: {
    email
  }
});
    } catch (err) {
  console.log(err.response);

  alert(
    err.response?.data ||
    err.message ||
    "Registration Failed"
  );
}
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">

        {/* LEFT SIDE */}
        <div className="auth-left">
          <h1>Create Account</h1>
          <p>
            Join now to shop faster, save your wishlist, manage orders, and enjoy a smoother shopping experience.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-card glass-card">
          <h2>Register</h2>
          <p className="auth-subtitle">Create your new account</p>

          <form onSubmit={handleRegister} className="auth-form">
            <div className="auth-input-group">
              <label data-text="EMAIL">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <label data-text="EMAIL">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="auth-input-group">
  <label data-text="EMAIL">Confirm Password</label>
  <input
    type="password"
    placeholder="Confirm Password"
    minLength={6}
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    required
  />
</div>
{confirmPassword && password !== confirmPassword && (
  <p style={{ color: "#ff4d4f", marginTop: "8px" }}>
    Passwords do not match
  </p>
)}

            <button className="auth-btn" type="submit" disabled={password !== confirmPassword}>
              <span className="btn-text">REGISTER</span>
            </button>

            <p className="auth-switch">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>Login</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;