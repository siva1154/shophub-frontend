import React from "react";
import {
  FaMobileAlt,
  FaLaptop,
  FaHeadphones,
  FaClock,
  FaCamera,
} from "react-icons/fa";
import "../styles/category-section.css";

const categories = [
  { name: "All Products", icon: "🛍️" },
  { name: "Mobile", icon: <FaMobileAlt /> },
  { name: "Laptop", icon: <FaLaptop /> },
  { name: "Headphone", icon: <FaHeadphones /> },
  { name: "Watch", icon: <FaClock /> },
  { name: "Camera", icon: <FaCamera /> },
];

const CategorySection = ({
  onSelectCategory,
}) => {
  return (
    <section className="category-section">
      <div className="category-header">
        <h2>Shop by Categories</h2>
        <p>
          Explore our most popular product
          categories.
        </p>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <div
            key={category.name}
            className="category-card"
           onClick={() =>
  onSelectCategory?.(
    category.name === "All Products"
      ? ""
      : category.name
  )
}
          >
            <div className="category-icon">
              {category.icon}
            </div>
            <h4>{category.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;