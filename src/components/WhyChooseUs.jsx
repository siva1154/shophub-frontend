import React from "react";
import {
  FaShippingFast,
  FaShieldAlt,
  FaUndo,
  FaHeadset,
} from "react-icons/fa";
import "../styles/why-choose-us.css";

const features = [
  {
    icon: <FaShippingFast />,
    title: "Free Delivery",
    description: "Fast and free shipping on all orders.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Secure Payments",
    description: "100% safe and encrypted transactions.",
  },
  {
    icon: <FaUndo />,
    title: "Easy Returns",
    description: "Hassle-free returns within 7 days.",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 Support",
    description: "Dedicated customer assistance anytime.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="why-choose-section">
      <div className="why-header">
        <h2>Why Choose Us</h2>
        <p>
          We provide the best shopping experience with trusted
          services and premium support.
        </p>
      </div>

      <div className="why-grid">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="why-card"
          >
            <div className="why-icon">
              {feature.icon}
            </div>
            <h4>{feature.title}</h4>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;