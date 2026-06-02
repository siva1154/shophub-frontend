import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers";
import AdminProducts from "./AdminProducts";
import "../styles/admin-dashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalStock: 0,
    latestProducts: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-wrapper">
        {/* HEADER */}
        <div className="admin-dashboard-header">
          <h2>Admin Dashboard</h2>
          <p>Manage products, users, inventory, and store performance</p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="admin-action-bar">
          <button
            className="secondary-btn"
            onClick={() => navigate("/")}
          >
            ← Back to Store
          </button>

          <button
            className="primary-btn"
            onClick={() => navigate("/add_product")}
          >
            + Add Product
          </button>

          <button
            className="danger-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card glass-card">
            <span className="admin-stat-icon">📦</span>
            <h4>Total Products</h4>
            <h2>{stats.totalProducts}</h2>
          </div>

          <div className="admin-stat-card glass-card">
            <span className="admin-stat-icon">👥</span>
            <h4>Total Users</h4>
            <h2>{stats.totalUsers}</h2>
          </div>

          <div className="admin-stat-card glass-card">
            <span className="admin-stat-icon">📊</span>
            <h4>Total Stock</h4>
            <h2>{stats.totalStock}</h2>
          </div>
        </div>

        {/* LATEST PRODUCTS */}
        <div className="latest-products-section glass-card">
          <h3>Latest Products</h3>

          {stats.latestProducts?.length === 0 ? (
            <p className="empty-text">No recent products available</p>
          ) : (
            <div className="latest-products-list">
              {stats.latestProducts.map((product) => (
                <div
                  key={product.id}
                  className="latest-product-item"
                >
                  <span className="latest-product-name">
                    {product.name}
                  </span>
                  <span className="latest-product-brand">
                    {product.brand}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT MANAGEMENT */}
<div className="admin-products-section">
  <AdminProducts />
</div>

{/* ORDER MANAGEMENT */}
<div className="admin-orders-section">
  <AdminOrders />
</div>

{/* USER MANAGEMENT */}
<div className="admin-users-section">
  <AdminUsers />
</div>

      </div>
    </div>
  );
};

export default AdminDashboard;