import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/adminCoupons.css";

const AdminCoupons = () => {

  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");

  const [coupons, setCoupons] = useState([]);

  const fetchCoupons = async () => {

    try {

      const res =
        await API.get("/admin/coupons");

      setCoupons(res.data);

    } catch (error) {

      console.error(error);
    }
  };

  useEffect(() => {

    fetchCoupons();

  }, []);

  const createCoupon = async () => {

    if (!code || !discountPercentage) {

      alert("Fill all fields");

      return;
    }

    try {

      await API.post(
        "/admin/coupons",
        {
          code,
          discountPercentage,
          active: true
        }
      );

      alert(
        "Coupon created successfully"
      );

      setCode("");
      setDiscountPercentage("");

      fetchCoupons();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to create coupon"
      );
    }
  };

  const toggleCoupon = async (id) => {

    try {

      await API.put(
        `/admin/coupons/${id}/toggle`
      );

      fetchCoupons();

    } catch (error) {

      console.error(error);
    }
  };

  return (

    <div className="admin-coupons-page">

      <div className="coupon-form">

        <h2>
          🎟 Coupon Management
        </h2>

        <input
          type="text"
          placeholder="Coupon Code"
          value={code}
          onChange={(e) =>
            setCode(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Discount %"
          value={discountPercentage}
          onChange={(e) =>
            setDiscountPercentage(
              e.target.value
            )
          }
        />

        <button
          onClick={createCoupon}
        >
          Create Coupon
        </button>

      </div>

      <div className="coupon-list">

        <h3>
          Existing Coupons
        </h3>

        {coupons.map((coupon) => (

          <div
            key={coupon.id}
            className="coupon-card"
          >

            <div>

              <strong>
                {coupon.code}
              </strong>

              <p>
                {coupon.discountPercentage}
                %
              </p>

            </div>

            <button
              onClick={() =>
                toggleCoupon(
                  coupon.id
                )
              }
            >

              {coupon.active
                ? "Disable"
                : "Enable"}

            </button>

          </div>
        ))}

      </div>

    </div>
  );
};

export default AdminCoupons;