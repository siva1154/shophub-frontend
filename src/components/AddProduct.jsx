import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/admin-add-product.css";

const AddProduct = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();

      formData.append("imageFile", image);
      formData.append(
        "product",
        new Blob([JSON.stringify(product)], {
          type: "application/json",
        })
      );

      const token = sessionStorage.getItem("token");

      await API.post("/product", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product added successfully");
      navigate("/");
    } catch (error) {
      console.error("Error adding product:", error);

      if (error.response?.status === 403) {
        alert("Unauthorized. Please login again.");
      } else {
        alert("Error adding product");
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-form-wrapper glass-card">
        <div className="admin-form-header">
          <h2>Add New Product</h2>
          <p>Create and publish a new product to your store</p>
        </div>

        <form className="admin-product-form" onSubmit={submitHandler}>
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                placeholder="Enter brand name"
                name="brand"
                value={product.brand}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                placeholder="Write a short product description"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                placeholder="Enter price"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={product.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select category</option>
                <option value="Laptop">Laptop</option>
                <option value="Headphone">Headphone</option>
                <option value="Mobile">Mobile</option>
                <option value="Electronics">Electronics</option>
                <option value="Toys">Toys</option>
                <option value="Fashion">Fashion</option>
              </select>
            </div>

            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                placeholder="Enter stock quantity"
                name="stockQuantity"
                value={product.stockQuantity}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Release Date</label>
              <input
                type="date"
                name="releaseDate"
                value={product.releaseDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Upload Product Image</label>
              <input type="file" onChange={handleImageChange} required />
            </div>

            {preview && (
              <div className="image-preview-box full-width">
                <img src={preview} alt="Preview" />
              </div>
            )}

            <div className="form-check-modern full-width">
              <input
                type="checkbox"
                checked={product.productAvailable}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    productAvailable: e.target.checked,
                  })
                }
              />
              <label>Product Available</label>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="submit-btn">
              Add Product
            </button>

            <button
              type="button"
              className="cancel-btn-admin"
              onClick={() => navigate("/admin")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;