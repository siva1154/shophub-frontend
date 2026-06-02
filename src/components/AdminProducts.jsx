import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/admin/products");
      setProducts(res.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (id) => {

  if (!window.confirm("Disable this product?"))
    return;

  try {

    await API.delete(`/product/${id}`);

    await fetchProducts();

    alert("Product disabled successfully");

  } catch (error) {

    console.error("Disable error:", error);

    alert("Failed to disable product");
  }
};

const restoreProduct = async (id) => {

  try {

    await API.put(
      `/product/${id}/restore`
    );

    fetchProducts();

    alert(
      "Product restored successfully"
    );

  } catch (error) {

    console.error(
      "Restore error:",
      error
    );

    alert(
      "Failed to restore product"
    );
  }
};

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Product Management</h3>

      <table className="table table-dark table-striped table-hover mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.brand}</td>
              <td>₹{product.price}</td>
              <td>{product.stockQuantity}</td>
              <td>
  {product.active ? (
    <span style={{color: "#00ff88",fontWeight: "bold"}}>
      🟢 Active
    </span>
  ) : (
    <span
      style={{color: "#ff4d4d",fontWeight: "bold"}}>
      🔴 Disabled
    </span>
  )}
</td>
              <td>
                 <button
    className="btn btn-warning btn-sm me-2"
    onClick={() =>
      navigate(
        `/product/update/${product.id}`
      )
    }
  >
    Edit
  </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteProduct(product.id)}
                >
                  Disable
                </button>

                 <button className="btn btn-success btn-sm"
                 onClick={() =>
      restoreProduct(product.id)
    }
  >
    Restore
  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;