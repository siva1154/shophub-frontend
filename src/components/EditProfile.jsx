import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/edit-profile.css";

const EditProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");
      setProfile(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const updateProfile = async () => {
    try {
      const updatedData = {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
      };

      const res = await API.put("/profile", updatedData);

      console.log("Updated Profile:", res.data);

      alert("Profile Updated Successfully");
      navigate("/profile");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-wrapper glass-card">
        <div className="edit-profile-header">
          <h2>Edit Profile</h2>
          <p>Update your personal information and account details</p>
        </div>

        <div className="edit-profile-form">
          <div className="edit-input-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={profile.name || ""}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="edit-input-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone || ""}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="edit-input-group full-width">
            <label>Address</label>
            <textarea
              rows="4"
              name="address"
              value={profile.address || ""}
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </div>

          <div className="edit-profile-actions">
            <button className="save-profile-btn" onClick={updateProfile}>
              Save Changes
            </button>

            <button
              className="cancel-profile-btn"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;