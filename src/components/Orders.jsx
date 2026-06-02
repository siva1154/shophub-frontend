import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import unplugged from "../assets/unplugged.png";
import "../styles/orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await API.put(`/orders/cancel/${orderId}`);

      alert("Order cancelled successfully");

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "CANCELLED" } : order
        )
      );
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Could not cancel order");
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-wrapper">

        <button className="back-btn" onClick={() => navigate("/profile")}>
          ← Back
        </button>

        <h2 className="orders-title">My Orders</h2>

        {orders.length === 0 ? (
          <div className="empty-orders glass-card">
            <p>You have not placed any orders yet.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div className="order-card glass-card" key={order.id}>

              {/* HEADER */}
              <div className="order-header">
                <h4>Order #{order.id}</h4>

                <span
                  className={`status-badge ${
                    order.status === "CANCELLED"
                      ? "cancelled"
                      : "active"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* DETAILS */}
              <div className="order-meta">
                <p>
                  <strong>Date:</strong>{" "}
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Total:</strong> ₹{order.totalAmount}
                </p>
              </div>

              {/* ADDRESS */}
              <div className="order-address">
                <h5>Delivery Address</h5>
                <p><strong>{order.address?.name}</strong> ({order.address?.type})</p>
                <p>{order.address?.addressLine}</p>
                <p>{order.address?.phone}</p>
              </div>

              {/* ITEMS */}
              <div className="order-items">
                <h5>Items</h5>

                {order.items?.map((item, idx) => (
                  <div
                    key={item.id ?? idx}
                    className="order-item-card"
                  >
                    <img
                      src={`http://localhost:8080/api/product/${item?.product?.id}/image`}
                      alt={item?.product?.name || "Product"}
                      onError={(e) => {
                        e.target.src = unplugged;
                      }}
                    />

                    <div className="order-item-info">
                      <h6>{item?.product?.name}</h6>
                      <p>Qty: {item.quantity}</p>
                      <p>₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ACTION */}
              {order.status !== "CANCELLED" && (
                <button
                  className="cancel-btn"
                  onClick={() => cancelOrder(order.id)}
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default Orders;