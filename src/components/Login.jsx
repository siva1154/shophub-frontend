import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

import "../styles/auth.css";

function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate = useNavigate();

  /* ==========================================
     LOGIN
  ========================================== */
  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const token = res.data.token;

      const role = res.data.role;

      /* SAVE TOKEN */
      sessionStorage.setItem(
        "token",
        token
      );

      sessionStorage.setItem(
        "role",
        role
      );

      alert("Login Successful ✅");

      /* ADMIN */
      if (role === "ADMIN") {

        navigate("/admin");
      }

      /* USER */
      else {

        navigate("/");
      }

    } catch (err) {

       console.log(err.response?.data);
      const message =
        err.response?.data;

     /* =========================
   ACCOUNT DEACTIVATED
========================= */
if (
  message ===
  "ACCOUNT_DEACTIVATED"
) {

  const reactivate =
    window.confirm(
      "Your account is deactivated.\n\nDo you want to reactivate it?"
    );

  if (reactivate) {

    try {

      /* REACTIVATE ACCOUNT */
      const reactivateRes =
        await API.post(
          `/auth/reactivate?email=${email}`
        );

      alert(
        reactivateRes.data
      );

      /* AUTO LOGIN AGAIN */
      const loginAgain =
        await API.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      const token =
        loginAgain.data.token;

      const role =
        loginAgain.data.role;

      sessionStorage.setItem(
        "token",
        token
      );

      sessionStorage.setItem(
        "role",
        role
      );

      alert(
        "Account reactivated successfully ✅"
      );

      /* ADMIN */
      if (role === "ADMIN") {

        navigate("/admin");
      }

      /* USER */
      else {

        navigate("/");
      }

    } catch (reactivateError) {

      alert(
        reactivateError.response?.data ||
        "Could not reactivate account"
      );
    }
  }

  return;
}

      /* =========================
         ACCOUNT BANNED
      ========================= */
      if (
        message ===
        "Your account has been banned"
      ) {

        alert(
          "Your account has been banned by admin."
        );

        return;
      }

      /* =========================
         INVALID LOGIN
      ========================= */
      alert(
        message ||
        "Invalid Email or Password"
      );
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-wrapper">

        {/* LEFT SIDE */}
        <div className="auth-left">

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to continue shopping,
            manage orders, wishlist,
            and your account.
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="auth-card glass-card">

          <h2>
            Login
          </h2>

          <p className="auth-subtitle">
            Access your account
          </p>

          <form
            onSubmit={handleLogin}
            className="auth-form"
          >

            {/* EMAIL */}
            <div className="auth-input-group">

             

              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
               <label data-text="EMAIL">
                Email
              </label>
            </div>

            {/* PASSWORD */}
            <div className="auth-input-group">

             
              <input
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
              />
               <label data-text="PASSWORD">
                Password
              </label>

            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-end mb-3">

              <span
                style={{
                  color: "#4f46e5",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                }}
                onClick={() =>
                  navigate(
                    "/forgot-password"
                  )
                }
              >
                Forgot Password?
              </span>

            </div>

            {/* LOGIN BUTTON */}
            <button className="auth-btn" type="submit" data-text="LOGIN">
  <span className="btn-text">LOGIN</span>
</button>

            {/* GOOGLE LOGIN */}
            <button
              type="button"
              className="google-login-btn"
              onClick={() => {

                window.location.href =
  "https://shophub-backend-osmy.onrender.com/oauth2/authorization/google";
              }}
            >

              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google"
              />

               <span className="btn-text">Continue with Google</span>

            </button>

            {/* REGISTER */}
            <p className="auth-switch">

              Don’t have an account?{" "}

              <span
                onClick={() =>
                  navigate("/register")
                }
              >
                Register
              </span>

            </p>

          </form>

        </div>
      </div>
    </div>
  );
}

export default Login;