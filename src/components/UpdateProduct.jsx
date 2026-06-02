import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/admin-update-product.css";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [image, setImage] = useState(null);

  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {

         const token = sessionStorage.getItem("token");
      const response = await API.get(
  `/admin/product/${id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
        setProduct(response.data);

       
const responseImage = await API.get(
  `/product/${id}/image`,
  {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
        const imageFile = await convertUrlToFile(
          responseImage.data,
          response.data.imageName
        );

        setImage(imageFile);
        setUpdateProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const convertUrlToFile = async (blobData, fileName) => {
    return new File([blobData], fileName, { type: blobData.type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedProduct = new FormData();
      updatedProduct.append("imageFile", image);
      updatedProduct.append(
        "product",
        new Blob([JSON.stringify(updateProduct)], {
          type: "application/json",
        })
      );

      const token = sessionStorage.getItem("token");

      await API.put(`/product/${id}`, updatedProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product updated successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="admin-update-page">
      <div className="admin-update-wrapper glass-card">
        <div className="admin-update-header">
          <h2>Update Product</h2>
          <p>Edit product details, inventory, and image</p>
        </div>

        <form className="admin-update-form" onSubmit={handleSubmit}>
          <div className="admin-update-grid">

            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={updateProduct.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                value={updateProduct.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={updateProduct.description}
                onChange={handleChange}
                placeholder="Write product description"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                value={updateProduct.price}
                onChange={handleChange}
                placeholder="Enter price"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={updateProduct.category}
                onChange={handleChange}
              >
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
                name="stockQuantity"
                value={updateProduct.stockQuantity}
                onChange={handleChange}
                placeholder="Enter stock quantity"
              />
            </div>

            <div className="form-group">
              <label>Release Date</label>
              <input
                type="date"
                name="releaseDate"
                value={updateProduct.releaseDate?.split("T")[0] || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Product Image</label>

              {image && (
                <div className="image-preview-box">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={product.imageName}
                  />
                </div>
              )}

              <input
                type="file"
                onChange={handleImageChange}
                name="imageUrl"
              />
            </div>

            <div className="form-check-modern full-width">
              <input
                type="checkbox"
                checked={updateProduct.productAvailable}
                onChange={(e) =>
                  setUpdateProduct({
                    ...updateProduct,
                    productAvailable: e.target.checked,
                  })
                }
              />
              <label>Product Available</label>
            </div>
          </div>

          <div className="admin-update-actions">
            <button type="submit" className="update-btn">
              Update Product
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

export default UpdateProduct;