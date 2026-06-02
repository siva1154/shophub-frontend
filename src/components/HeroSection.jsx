import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/hero-section.css";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-content">
        <span className="hero-badge">🔥 New Collection 2026</span>

        <h1>
          Discover Premium
          <span> Electronics</span>
        </h1>

        <p>
          Shop the latest mobiles, laptops, accessories,
          and gadgets at unbeatable prices.
        </p>

        <div className="hero-buttons">
          <button
            className="hero-primary-btn"
            onClick={() => navigate("/")}
          >
            Shop Now
          </button>

          <button
            className="hero-secondary-btn"
            onClick={() =>
              window.scrollTo({
                top: 700,
                behavior: "smooth",
              })
            }
          >
            Explore Products
          </button>
        </div>
      </div>

      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
          alt="Premium Electronics"
        />
      </div>
    </section>
  );
};

export default HeroSection;