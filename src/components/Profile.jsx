import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");
      console.log("Fetched Profile:", res.data);
      setProfile(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-wrapper">
          <h2 className="profile-title">Loading Profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-wrapper">
        <h2 className="profile-title">My Account</h2>

        <div className="profile-card glass-card">
          <div className="profile-avatar-wrapper">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              className="profile-avatar"
              alt="Profile"
            />
          </div>

          <div className="profile-info">
            <h3>{profile?.name || "Add your name"}</h3>

            {/* Email comes from nested user object */}
            <p>{profile?.user?.email || "No email found"}</p>

            <div className="profile-extra">
              <p>
                <strong>Phone:</strong>{" "}
                {profile?.phone || "Not provided"}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {profile?.address || "Not provided"}
              </p>
            </div>

            <button
              className="edit-profile-btn"
              onClick={() => navigate("/edit-profile")}
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="account-grid">
          <div
            className="account-box"
            onClick={() => navigate("/orders")}
          >
            <h4>Orders</h4>
            <p>Track and manage your purchases.</p>
          </div>

          <div
            className="account-box"
            onClick={() => navigate("/wishlist")}
          >
            <h4>Wishlist</h4>
            <p>View your saved products.</p>
          </div>

          <div
            className="account-box"
            onClick={() => navigate("/addresses")}
          >
            <h4>Addresses</h4>
            <p>Manage delivery locations.</p>
          </div>

          <div
            className="account-box"
            onClick={() => navigate("/settings")}
          >
            <h4>Settings</h4>
            <p>Update preferences and account options.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;