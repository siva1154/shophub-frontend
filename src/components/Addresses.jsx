import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/addresses.css";

const Addresses = () => {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    type: "Home",
    name: "",
    phone: "",
    addressLine: ""
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await API.get("/addresses");

      const safeAddresses = res.data.map((item, index) => ({
        ...item,
        id: item.id ?? `addr-${index}`
      }));

      setAddresses(safeAddresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      type: "Home",
      name: "",
      phone: "",
      addressLine: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddOrUpdate = async () => {
    try {
      if (!formData.name || !formData.phone || !formData.addressLine) {
        alert("Please fill all fields");
        return;
      }

      if (editingId) {
        const res = await API.put(`/addresses/${editingId}`, formData);

        setAddresses((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? { ...res.data, id: res.data.id ?? editingId }
              : item
          )
        );
      } else {
        const res = await API.post("/addresses", formData);

        setAddresses((prev) => [
          ...prev,
          { ...res.data, id: res.data.id ?? Date.now() }
        ]);
      }

      resetForm();
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      type: item.type,
      name: item.name,
      phone: item.phone,
      addressLine: item.addressLine
    });

    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/addresses/${id}`);
      setAddresses((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <div className="addresses-page">
      <div className="addresses-wrapper">
        <button className="address-back-btn" onClick={() => navigate("/profile")}>
          ← Back
        </button>

        <div className="addresses-header">
          <div>
            <h2>My Addresses</h2>
            <p>Manage your delivery locations easily</p>
          </div>

          <button
            className="add-address-btn"
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                type: "Home",
                name: "",
                phone: "",
                addressLine: ""
              });
            }}
          >
            + Add New Address
          </button>
        </div>

        {showForm && (
          <div className="address-form-card glass-card">
            <h4>{editingId ? "Edit Address" : "Add New Address"}</h4>

            <div className="address-form-grid">
              <div className="form-group">
                <label>Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <textarea
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleChange}
                  placeholder="Enter full delivery address"
                  rows="4"
                />
              </div>
            </div>

            <div className="address-form-actions">
              <button className="save-address-btn" onClick={handleAddOrUpdate}>
                {editingId ? "Update Address" : "Save Address"}
              </button>

              <button className="cancel-address-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="address-list-grid">
          {addresses.length === 0 ? (
            <div className="empty-address-card glass-card">
              <p>No addresses added yet.</p>
            </div>
          ) : (
            addresses.map((item, index) => (
              <div
                className="address-card-modern glass-card"
                key={item.id ?? `addr-${index}`}
              >
                <div className="address-badge">{item.type}</div>

                <h4>{item.name}</h4>
                <p><strong>Phone:</strong> {item.phone}</p>
                <p><strong>Address:</strong> {item.addressLine}</p>

                <div className="address-card-actions">
                  <button
                    className="edit-address-btn"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-address-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Addresses;