import React, {
  useEffect
} from "react";

import {
  useNavigate
} from "react-router-dom";

const OAuthSuccess = () => {

  const navigate =
    useNavigate();

  useEffect(() => {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const token =
      params.get("token");

    const role =
      params.get("role");

    console.log(token);
    console.log(role);

    if (token && role) {

      /* SAVE TOKEN */

      sessionStorage.setItem(
        "token",
        token
      );

      sessionStorage.setItem(
        "role",
        role
      );

      /* WAIT FOR STORAGE */

      setTimeout(() => {

        if (role === "ADMIN") {

          window.location.href =
            "/admin";
        }

        else {

          window.location.href =
            "/";
        }

      }, 100);

    }

    else {

      navigate("/login");
    }

  }, [navigate]);

  return (

    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        color: "#fff",
        fontSize: "1.2rem"
      }}
    >
      Logging you in...
    </div>
  );
};

export default OAuthSuccess;