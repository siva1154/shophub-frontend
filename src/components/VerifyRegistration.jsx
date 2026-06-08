import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/auth.css";

function VerifyRegistration() {

  const [otp, setOtp] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleResendOtp = async () => {

  try {

    await API.post(
      `/auth/resend-registration-otp?email=${email}`
    );

    alert("OTP sent successfully");

  } catch (error) {

    alert("Unable to resend OTP");
  }
};


  const handleVerify = async (e) => {
    e.preventDefault();

    try {

      await API.post(
        `/auth/verify-registration?email=${email}&otp=${otp}`
      );

      alert("Email verified successfully!");

      navigate("/login");

    } catch (error) {

  const message =
    error.response?.data ||
    "Invalid OTP";

  alert(message);
}
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">

        <div className="auth-left">
          <h1>Email Verification</h1>

          <p>
            We've sent a verification code to your email.
            Enter the 6-digit OTP below.
          </p>
        </div>

        <div className="auth-card glass-card">

          <h2>Verify OTP</h2>

          <p className="auth-subtitle">
            Check your inbox and enter the code
          </p>

          <form
            onSubmit={handleVerify}
            className="auth-form"
          >

            <div className="auth-input-group">
            

              <input
                type="text"
                maxLength="6"
                placeholder=" "
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value)
                }
                required
              />
               <label data-text="OTP">OTP</label>
            </div>

            <button
              className="auth-btn"
              type="submit"
               data-text="VERIFY EMAIL"
            >
               <span className="btn-text">Verify Email</span>
            </button>

            <button
  type="button"
  className="auth-btn"
  onClick={handleResendOtp}
   data-text="RESEND OTP"
>
  <span className="btn-text">Resend OTP</span>
</button>


          </form>

        </div>
      </div>
    </div>
  );
}

export default VerifyRegistration;