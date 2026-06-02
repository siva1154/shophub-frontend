import React, { useState } from "react";
import "../styles/newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    alert("Subscribed successfully! 🎉");
    setEmail("");
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-card">
        <div className="newsletter-content">
          <span className="newsletter-badge">
            🎁 Exclusive Offers
          </span>

          <h2>
            Subscribe to Our Newsletter
          </h2>

          <p>
            Get the latest product launches,
            special discounts, and exclusive
            offers directly to your inbox.
          </p>

          <form
            className="newsletter-form"
            onSubmit={handleSubscribe}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <button type="submit">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;