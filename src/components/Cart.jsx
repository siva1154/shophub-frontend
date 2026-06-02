import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";
import API from "../api/axios";
import CheckoutPopup from "./CheckoutPopup";
import "../styles/cart.css";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const navigate = useNavigate();

  // Fetch cart items + images
  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      try {
        const response = await API.get("/products");
        const backendProductIds = response.data.map((p) => p.id);

        const updatedCartItems = cart.filter((item) =>
          backendProductIds.includes(item.id)
        );

        const cartItemsWithImages = await Promise.all(
          updatedCartItems.map(async (item) => {
            try {
              const res = await API.get(`/product/${item.id}/image`, {
                responseType: "blob",
              });

              const imageUrl = URL.createObjectURL(res.data);
              return { ...item, imageUrl };
            } catch (error) {
              console.error("Image error:", error);
              return { ...item, imageUrl: "" };
            }
          })
        );

        setCartItems(cartItemsWithImages);
      } catch (error) {
        console.error("Cart fetch error:", error);
      }
    };

    if (cart.length) {
      fetchImagesAndUpdateCart();
    } else {
      setCartItems([]);
    }
  }, [cart]);

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await API.get("/addresses");
        setAddresses(res.data || []);
      } catch (error) {
        console.error("Address error:", error);
      }
    };

    fetchAddresses();
  }, []);

  // Calculate total
  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  // Quantity increase
  const handleIncreaseQuantity = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id && item.quantity < item.stockQuantity
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCartItems(updated);
  };

  // Quantity decrease
  const handleDecreaseQuantity = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(updated);
  };

  // Remove item
  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Checkout
  const handleCheckout = async () => {
    try {
      if (!selectedAddress) {
        alert("Please select a delivery address");
        return;
      }

      if (!paymentMethod) {
        alert("Please select a payment method");
        return;
      }

      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const payload = {
        cartItems: orderItems,
        addressId: selectedAddress,
        paymentMethod: paymentMethod,
        couponCode: couponCode
      };

      if (paymentMethod === "COD") {
        await API.post("/orders", payload);

        alert("Order placed successfully 🎉");

        clearCart();
        setCartItems([]);
        setShowModal(false);
        setSelectedAddress("");
        setPaymentMethod("");

        navigate("/orders");
      } else if (paymentMethod === "RAZORPAY") {
       const finalAmount =
  totalPrice - discount;

const res = await API.post(
  `/payment/create-order?amount=${finalAmount}`
);
        const order = typeof res.data === "string" ? JSON.parse(res.data) : res.data;

        const options = {
          key: "rzp_test_SaZ03zzfoQqnp3",
          amount: order.amount,
          currency: "INR",
          name: "My Store",
          description: "Order Payment",
          order_id: order.id,

          handler: async function () {
            const payload = {
              cartItems: cartItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
              })),
              addressId: selectedAddress,
              paymentMethod: "RAZORPAY",
               couponCode: couponCode
            };

            await API.post("/orders", payload);

            alert("Payment successful 🎉 Order placed!");

            clearCart();
            setCartItems([]);
            setShowModal(false);
            setSelectedAddress("");
            setPaymentMethod("");

            navigate("/orders");
          },

          modal: {
            ondismiss: function () {
              alert("Payment cancelled");
            },
          },

          prefill: {
            name: "Customer",
            email: "test@gmail.com",
          },

          theme: {
            color: "#4f46e5",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error("Checkout error:", error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        sessionStorage.clear();
        navigate("/login");
      } else {
        alert(error.response?.data?.message || "Order failed");
      }
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-wrapper">
        <div className="cart-header">
          <h2>Shopping Bag</h2>
          <p>{cartItems.length} item(s) in your cart</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart glass-card">
            <h4>Your cart is empty</h4>
            <p>Add products to continue shopping.</p>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card glass-card">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="cart-item-image"
                  />

                  <div className="cart-item-info">
                    <span className="cart-brand">{item.brand}</span>
                    <h4>{item.name}</h4>
                    <p className="cart-price">₹{item.price}</p>
                  </div>

                  <div className="cart-qty-controls">
                    <button onClick={() => handleDecreaseQuantity(item.id)}>-</button>
                    <input value={item.quantity} readOnly />
                    <button onClick={() => handleIncreaseQuantity(item.id)}>+</button>
                  </div>

                  <div className="cart-total-item">
                    ₹{item.price * item.quantity}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary glass-card">
              <div>
                <h3>Total</h3>
                <p>₹{totalPrice}</p>
              </div>

              <button className="checkout-btn" onClick={() => setShowModal(true)}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
        addresses={addresses}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        discount={discount}
        setDiscount={setDiscount}
      />
    </div>
  );
};

export default Cart;