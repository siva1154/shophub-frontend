import React, {
  useEffect,
  useState
} from "react";
import API from "../api/axios";

import {
  Modal,
  Button,
  Form
} from "react-bootstrap";

import "../styles/checkout.css";



const CheckoutPopup = ({

  show,

  handleClose,

  cartItems,

  totalPrice,

  handleCheckout,

  addresses,

  selectedAddress,

  setSelectedAddress,

  paymentMethod,

  setPaymentMethod,

  couponCode,
   setCouponCode,
  discount,
  setDiscount

}) => {

  const [availableCoupons, setAvailableCoupons] = useState([]);

  useEffect(() => {

  fetchCoupons();

}, []);

const fetchCoupons = async () => {

  try {

    const res =
      await API.get(
        "/coupons/active"
      );

    setAvailableCoupons(
      res.data
    );

  } catch (error) {

    console.error(
      "Error fetching coupons",
      error
    );
  }
};

  const applyCoupon = async () => {

  if (!couponCode.trim()) {

    alert("Enter coupon code");

    return;
  }

  try {

    const res =
      await API.get(
        `/coupons/validate/${couponCode}`
      );

    const discountAmount =
      (totalPrice *
        res.data.discountPercentage)
      / 100;

    setDiscount(discountAmount);

    alert(
      `${res.data.discountPercentage}% discount applied`
    );

  } catch (error) {

    alert(
      "Invalid coupon"
    );

    setDiscount(0);
  }
};

  return (

    <Modal

      show={show}

      onHide={handleClose}

      centered

      size="lg"

      className="checkout-popup"

    >

      {/* HEADER */}

      <Modal.Header closeButton>

        <Modal.Title>
          Checkout
        </Modal.Title>

      </Modal.Header>

      {/* BODY */}

      <Modal.Body>

        {/* ITEMS */}

        <div className="checkout-items">

          {cartItems.map((item) => (

            <div

              key={item.id}

              className="checkout-item-card"
            >

              {/* IMAGE */}

              <img

                src={item.imageUrl}

                alt={item.name}

                className="checkout-item-image"

              />

              {/* INFO */}

              <div className="checkout-item-info">

                <h5>
                  {item.name}
                </h5>

                <p>
                  Qty: {item.quantity}
                </p>

                <p>
                  ₹{item.price * item.quantity}
                </p>

              </div>

            </div>
          ))}

        </div>

        {/* TOTAL */}

        <div className="checkout-total-box">

          <h4>
  Subtotal: ₹{totalPrice}
</h4>

{discount > 0 && (

  <h5>
    Discount: -₹
    {discount.toFixed(2)}
  </h5>

)}

<h3>

  Total: ₹

  {(totalPrice - discount)
    .toFixed(2)}

</h3>

        </div>

<div className="checkout-section">

   <div className="available-coupons">

    <h5>
      🎟 Available Coupons
    </h5>

    {availableCoupons.length === 0 ? (

      <p>
        No active coupons available
      </p>

    ) : (

      availableCoupons.map(
        (coupon) => (

          <div
            key={coupon.id}
            className="coupon-suggestion"
          >

            <div>

              <strong>
                {coupon.code}
              </strong>

              <p>
                {coupon.discountPercentage}
                % OFF
              </p>

            </div>

            <button

              type="button"

              onClick={() =>

                setCouponCode(
                  coupon.code
                )

              }

            >

              Use

            </button>

          </div>
        )
      )
    )}

  </div>

  <h5>
    Coupon Code
  </h5>

  <div className="coupon-box">

    <input
      type="text"
      value={couponCode}
      placeholder="Enter Coupon"
      onChange={(e) =>
        setCouponCode(
          e.target.value
        )
      }
    />

    <button
      onClick={applyCoupon}
    >
      Apply
    </button>

  </div>

</div>

        {/* ADDRESS */}

        <div className="checkout-section">

          <h5>
            Select Delivery Address
          </h5>

          {addresses.length === 0 ? (

            <p className="checkout-warning">

              No addresses found.
              Please add one first.

            </p>

          ) : (

            <Form.Select

              value={selectedAddress}

              onChange={(e) =>

                setSelectedAddress(
                  e.target.value
                )
              }

            >

              <option value="">
                Choose Address
              </option>

              {addresses.map((addr) => (

                <option

                  key={addr.id}

                  value={addr.id}

                >

                  {addr.type}
                  {" - "}
                  {addr.name},
                  {" "}
                  {addr.addressLine},
                  {" "}
                  {addr.phone}

                </option>
              ))}

            </Form.Select>
          )}

        </div>

        {/* PAYMENT */}

        <div className="checkout-section">

          <h5>
            Select Payment Method
          </h5>

          <div className="payment-options">

            {/* COD */}

            <label

              className={`payment-card ${
                paymentMethod === "COD"
                  ? "active"
                  : ""
              }`}

            >

              <input

                type="radio"

                name="paymentMethod"

                value="COD"

                checked={
                  paymentMethod === "COD"
                }

                onChange={(e) =>

                  setPaymentMethod(
                    e.target.value
                  )
                }

              />

              <span>
                💵 Cash on Delivery
              </span>

            </label>

            {/* ONLINE */}

            <label

              className={`payment-card ${
                paymentMethod === "RAZORPAY"
                  ? "active"
                  : ""
              }`}

            >

              <input

                type="radio"

                name="paymentMethod"

                value="RAZORPAY"

                checked={
                  paymentMethod === "RAZORPAY"
                }

                onChange={(e) =>

                  setPaymentMethod(
                    e.target.value
                  )
                }

              />

              <span>
                💳 Online Payment
              </span>

            </label>

          </div>

        </div>

      </Modal.Body>

      {/* FOOTER */}

      <Modal.Footer>

        <Button

          variant="outline-secondary"

          onClick={handleClose}

        >

          Close

        </Button>

        <Button

          variant="primary"

          onClick={handleCheckout}

          disabled={
            !selectedAddress ||
            !paymentMethod
          }

        >

          {paymentMethod === "RAZORPAY"

            ? "Proceed to Pay"

            : "Confirm Order"}

        </Button>

      </Modal.Footer>

    </Modal>
  );
};

export default CheckoutPopup;