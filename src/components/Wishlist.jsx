import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import unplugged from "../assets/unplugged.png";
import "../styles/wishlist.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await API.get("/wishlist");
      setWishlist(res.data || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await API.delete(`/wishlist/${productId}`);

      setWishlist((prev) =>
        prev.filter((item) => item?.product?.id !== productId)
      );
    } catch (error) {
      console.error("Error removing wishlist item:", error);
    }
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-wrapper">

        <button className="wishlist-back-btn" onClick={() => navigate("/profile")}>
          ← Back
        </button>

        <div className="wishlist-header">
          <h2>My Wishlist</h2>
          <p>Products you saved for later</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-wishlist glass-card">
            <h4>Your wishlist is empty</h4>
            <p>Start adding products you love ❤️</p>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((item, index) => (
              <div
                className="wishlist-card glass-card"
                key={item.id ?? `wish-${index}`}
              >
                {/* IMAGE */}
                <div className="wishlist-image-container">
                  <img
                    src={`http://localhost:8080/api/product/${item?.product?.id}/image`}
                    alt={item?.product?.name || "Product"}
                    onError={(e) => {
                      e.target.src = unplugged;
                    }}
                  />
                </div>

                {/* INFO */}
                <div className="wishlist-info">
                  <h4>{item?.product?.name}</h4>
                  <p className="wishlist-price">₹{item?.product?.price}</p>
                </div>

                {/* ACTIONS */}
                <div className="wishlist-actions">
                  <button
                    className="view-btn"
                    onClick={() => navigate(`/product/${item?.product?.id}`)}
                  >
                    View
                  </button>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromWishlist(item?.product?.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;