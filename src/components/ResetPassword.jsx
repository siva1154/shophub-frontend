import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [form, setForm] = useState({
    email: email,
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (form.newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post(
        "/auth/reset-password",
        form
      );

      alert(res.data || "Password reset successfully");

      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data ||
        "Failed to reset password";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card">
        <h2>Reset Password</h2>
        <p>Enter the OTP sent to your email.</p>

        <form onSubmit={handleResetPassword}>
          <input
            type="email"
            className="form-control mb-3"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />

          <input
            type="text"
            className="form-control mb-3"
            name="otp"
            value={form.otp}
            onChange={handleChange}
            placeholder="Enter OTP"
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="New Password"
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm New Password"
            required
          />

          <button
            type="submit"
            className="primary-btn w-100"
            disabled={loading}
          >
            {loading
              ? "Resetting Password..."
              : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;