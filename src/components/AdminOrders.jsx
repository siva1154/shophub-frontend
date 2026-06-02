import React, { useEffect, useState } from "react";
import API from "../api/axios";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/admin/orders");
      setOrders(res.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await API.put(
        `/admin/orders/${orderId}/status?status=${newStatus}`
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      alert("Order status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status");
    }
  };

  const getPaymentBadgeClass = (paymentStatus) => {
    switch (paymentStatus) {
      case "PAID":
        return "bg-success";
      case "FAILED":
        return "bg-danger";
      case "REFUNDED":
        return "bg-secondary";
      default:
        return "bg-warning text-dark";
    }
  };

  const getOrderBadgeClass = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-success";
      case "CANCELLED":
        return "bg-danger";
      case "SHIPPED":
      case "OUT_FOR_DELIVERY":
        return "bg-primary";
      case "CONFIRMED":
        return "bg-info text-dark";
      default:
        return "bg-warning text-dark";
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Order Management</h3>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-dark table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Current Status</th>
                <th>Update Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  {/* ORDER ID */}
                  <td>#{order.id}</td>

                  {/* CUSTOMER */}
                  <td>
                    <strong>{order.address?.name || "N/A"}</strong>
                    <br />
                    <small>{order.address?.phone || ""}</small>
                  </td>

                  {/* TOTAL */}
                  <td>₹{order.totalAmount}</td>

                  {/* PAYMENT METHOD */}
                  <td>
                    <span className="badge bg-secondary">
                      {order.paymentMethod || "N/A"}
                    </span>
                  </td>

                  {/* PAYMENT STATUS */}
                  <td>
                    <span
                      className={`badge ${getPaymentBadgeClass(
                        order.paymentStatus || "PENDING"
                      )}`}
                    >
                      {order.paymentStatus || "PENDING"}
                    </span>
                  </td>

                  {/* ORDER STATUS */}
                  <td>
                    <span
                      className={`badge ${getOrderBadgeClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* UPDATE STATUS */}
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order.id, e.target.value)
                      }
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* DATE */}
                  <td>
                    {order.orderDate
                      ? new Date(
                          order.orderDate
                        ).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;