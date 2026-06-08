import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post(
        "/auth/forgot-password",
        { email }
      );

      alert(res.data || "OTP sent successfully");

      navigate("/reset-password", {
        state: { email },
      });
    } catch (error) {
      const message =
        error.response?.data || "Failed to send OTP";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card">
        <h2>Forgot Password</h2>
        <p>Enter your registered email address.</p>

        <form onSubmit={handleSendOtp}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder=" "
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <button type="submit" className="primary-btn w-100" disabled={loading} data-text={loading ? "SENDING..." : "SEND OTP"}>
  <span className="btn-text">{loading ? "Sending OTP..." : "Send OTP"}</span>
</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;