import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHeart,
  FaShoppingCart,
  FaUserCircle,
  FaTachometerAlt,
} from "react-icons/fa";

import "../styles/navbar.css";

const Navbar = ({
  searchQuery,
  setSearchQuery,
}) => {

  const navigate = useNavigate();
  const location = useLocation();

  const [showDropdown, setShowDropdown] =
    useState(false);

  const isLoggedIn =
    !!sessionStorage.getItem("token");

  const role =
    sessionStorage.getItem("role");

  const isAdmin =
    role === "ADMIN";

  const isAdminPage =
    location.pathname.startsWith("/admin");

  const handleLogout = () => {

    sessionStorage.clear();

    setShowDropdown(false);

    navigate("/login");

    window.location.reload();
  };

  const goTo = (path) => {

    setShowDropdown(false);

    navigate(path);
  };

  return (

    <nav className="premium-navbar">

      {/* LOGO */}

      <div
        className="navbar-logo"
        onClick={() =>
          navigate(
            isAdmin
              ? "/admin"
              : "/"
          )
        }
      >

        <span className="logo-main">
          Shop
        </span>

        <span className="logo-accent">
          Hub
        </span>

      </div>

      {/* SEARCH */}

      {!isAdminPage && (

        <div className="navbar-search">

          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(
                e.target.value
              )
            }
          />

        </div>
      )}

      {/* RIGHT SIDE */}

      <div className="navbar-right">

        {/* HOME */}

        <Link
          to="/"
          className="nav-link-text"
        >

          🏠 Home

        </Link>

        {/* ADMIN DASHBOARD */}

        {isAdmin && (

          <Link
            to="/admin"
            className="nav-link-text"
          >

            <FaTachometerAlt
              style={{
                marginRight: "6px",
              }}
            />

            Dashboard

          </Link>
        )}

        {/* USER FEATURES */}

        {isLoggedIn &&
          !isAdminPage && (

          <>

            <Link
              to="/wishlist"
              className="nav-icon-btn"
            >

              <FaHeart />

            </Link>

            <Link
              to="/cart"
              className="nav-icon-btn"
            >

              <FaShoppingCart />

            </Link>

          </>
        )}

        {/* PROFILE */}

        {isLoggedIn ? (

          <div className="profile-menu">

            <button
              className="profile-btn"
              onClick={() =>
                setShowDropdown(
                  !showDropdown
                )
              }
            >

              <FaUserCircle />

              <span>

                {isAdmin
                  ? "Admin"
                  : "Profile"}

              </span>

            </button>

            {showDropdown && (

              <div className="profile-dropdown">

                {/* ADMIN MENU */}

              {isAdmin && (

  <>

    <p
      onClick={() =>
        goTo("/admin")
      }
    >
      Admin Dashboard
    </p>

    <p
      onClick={() =>
        goTo(
          "/admin/promotions"
        )
      }
    >
      📢 Promotions
    </p>

    <p
      onClick={() =>
        goTo(
          "/admin/coupons"
        )
      }
    >
      🎟 Coupons
    </p>

  </>

)}

                {/* COMMON */}

                <p
                  onClick={() =>
                    goTo("/profile")
                  }
                >

                  My Profile

                </p>

                <p
                  onClick={() =>
                    goTo("/orders")
                  }
                >

                  Orders

                </p>

                <p
                  onClick={() =>
                    goTo("/wishlist")
                  }
                >

                  Wishlist

                </p>

                <p
                  onClick={() =>
                    goTo("/addresses")
                  }
                >

                  Addresses

                </p>

                <p
                  onClick={() =>
                    goTo("/settings")
                  }
                >

                  Settings

                </p>

                <p
                  className="logout-text"
                  onClick={
                    handleLogout
                  }
                >

                  Logout

                </p>

              </div>

            )}

          </div>

        ) : (

          <div className="auth-buttons">

            <button
              className="nav-auth-btn"
              onClick={() =>
                navigate("/login")
              }
            >

              Login

            </button>

            <button
              className="nav-auth-btn outline"
              onClick={() =>
                navigate(
                  "/register"
                )
              }
            >

              Register

            </button>

          </div>

        )}

      </div>

    </nav>
  );
};

export default Navbar;