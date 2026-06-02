import React, { useState } from "react";
import API from "../api/axios";
import "../styles/adminPromotions.css";

const AdminPromotions = () => {

  const [subject, setSubject] = useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const sendPromotion = async () => {

    if (!subject.trim() || !message.trim()) {

      alert("Please fill all fields");

      return;
    }

    try {

      setLoading(true);

      const res = await API.post(
        "/admin/promotions/send",
        {
          subject,
          message
        }
      );

      alert(res.data);

      setSubject("");
      setMessage("");

    } catch (error) {

      console.error(error);

      alert("Failed to send promotion");
    }

    finally {

      setLoading(false);
    }
  };

  return (

    <div className="promotion-page">

      <div className="promotion-card">

        <h2>
          📢 Send Promotional Email
        </h2>

        <input
          type="text"
          placeholder="Email Subject"
          value={subject}
          onChange={(e) =>
            setSubject(e.target.value)
          }
        />

        <textarea
          rows="8"
          placeholder="Promotion Message"
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
        />

        <button
          onClick={sendPromotion}
          disabled={loading}
        >

          {loading
            ? "Sending..."
            : "Send Promotion"}

        </button>

      </div>

    </div>
  );
};

export default AdminPromotions;