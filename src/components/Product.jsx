import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import AppContext from "../Context/Context";
import "../styles/product.css";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const [reviews, setReviews] = useState([]);
const [rating, setRating] = useState(5);
const [comment, setComment] = useState("");
const [averageRating, setAverageRating] = useState(0);
const [hasReviewed, setHasReviewed] = useState(false);
const [recentProducts,setRecentProducts] = useState([]);

  // Check if logged-in user is admin
  const role = sessionStorage.getItem("role");
  const isAdmin = role === "ADMIN";

 useEffect(() => {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  fetchProduct();
  fetchReviews();
  // fetchRecentlyViewed();

  return () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
  };

}, [id]);

const fetchRecentlyViewed = async () => {

    try {

      const viewed =JSON.parse(
          localStorage.getItem(
            "recentlyViewed"
          )
        ) || [];

      const ids =viewed.filter(
          (productId) =>
            productId !== Number(id)
        );

    
     const products =await Promise.all(

    ids.map(async (productId) => {

      try {

        const productRes = await API.get(
            `/product/${productId}`
          );

        try {

          const imageRes = await API.get(
              `/product/${productId}/image`,
              {
                responseType: "blob"
              }
            );

          productRes.data.imageUrl =  URL.createObjectURL(imageRes.data);

        } catch {}

        return productRes.data;

      }catch (error) {

  if (error.response?.status !== 404) {
    console.error(error);
  }

  const updatedViewed =viewed.filter(
      (id) => id !== productId
    );

  localStorage.setItem(
    "recentlyViewed",
    JSON.stringify(updatedViewed)
  );

  return null;
}
    })
  );

setRecentProducts(
  products.filter(Boolean));

    } catch (error) {

      console.error(error);
    }
};

  const fetchProduct = async () => {
    try {
    
      const res = await API.get(`/product/${id}`);
      setProduct(res.data);
      const viewed =JSON.parse(
    localStorage.getItem(
      "recentlyViewed"
    )
  ) || [];

const filtered = viewed.filter(
    (productId) =>
      productId !== res.data.id
  );

filtered.unshift(
  res.data.id
);

localStorage.setItem(
  "recentlyViewed",
  JSON.stringify(
    filtered.slice(0, 6)
  )
);


fetchRecentlyViewed();

      const imageRes = await API.get(`/product/${id}/image`, {
        responseType: "blob",
      });

      const imageObjectUrl = URL.createObjectURL(imageRes.data);
      setImageUrl(imageObjectUrl);
    } 
    catch (error) {

  const viewed =JSON.parse(
      localStorage.getItem("recentlyViewed")
    ) || [];

  const updatedViewed = viewed.filter(
      (productId) =>
        productId !== Number(id)
    );

  localStorage.setItem(
    "recentlyViewed",
    JSON.stringify(updatedViewed)
  );

  alert(
    "This product is no longer available"
  );

  navigate("/");
}
  };

  const fetchReviews = async () => {
    try {

  const reviewCheck = await API.get(
      `/reviews/has-reviewed/${id}`
    );

  setHasReviewed(
    reviewCheck.data
  );

} catch (error) {

  console.error(
    "Review status error",
    error
  );
}
  try {

    const reviewRes =await API.get(`/reviews/${id}`);

    setReviews(reviewRes.data);

    const ratingRes =await API.get(
        `/reviews/${id}/rating`
      );

    setAverageRating(
      ratingRes.data
    );

  } catch (error) {

    console.error(
      "Review fetch error:",
      error
    );
  }
};

const submitReview = async () => {

  try {

    await API.post(
      "/reviews",
      {
        productId: Number(id),
        rating,
        comment
      }
    );

    alert(
      "Review added successfully"
    );

    setComment("");
    setRating(5);

    fetchReviews();

  } catch (error) {

    alert(
      error.response?.data ||
      "Failed to add review"
    );
  }
};

  const handleDeleteProduct = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to disable this product?"
  );

  if (!confirmed) return;

  try {
    await API.delete(`/product/${product.id}`);

    const viewed =
      JSON.parse(
        localStorage.getItem("recentlyViewed")
      ) || [];

    const updatedViewed =
      viewed.filter(
        (id) => id !== product.id
      );

    localStorage.setItem(
      "recentlyViewed",
      JSON.stringify(updatedViewed)
    );

    alert("Product disabled successfully");

    navigate("/admin");

  } catch (error) {

    console.error("Disable failed:", error);

    alert("Failed to disable product");
  }
};

  if (!product) {
    return (
      <div className="product-page">
        <h2>Loading product...</h2>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="product-wrapper glass-card">
        {/* LEFT IMAGE */}
        <div className="product-image-section">
          <img
            src={imageUrl}
            alt={product.name}
            className="product-main-image"
          />
        </div>

        {/* RIGHT DETAILS */}
        <div className="product-details-section">
          <span className="product-brand">
            {product.brand}
          </span>

          <h1>{product.name}</h1>

          <div className="product-price">
            ₹{product.price}
          </div>

          <div
  className={`stock-badge ${
    product.stockQuantity > 0
      ? "in-stock"
      : "out-stock"
  }`}
>
  {product.stockQuantity > 0
    ? "In Stock"
    : "Out of Stock"}
</div>

          <p className="product-description">
            {product.description}
          </p>

          <div className="product-meta">
            <p>
              <strong>Category:</strong>{" "}
              {product.category}
            </p>
            <p>
              <strong>Stock:</strong>{" "}
              {product.stockQuantity}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="product-actions">
            {/* Customer Button */}
            <button
              className="buy-btn"
              disabled={product.stockQuantity <= 0}
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>

            {/* Admin Buttons */}
            {isAdmin && (
              <>
                <button
                  className="btn btn-warning"
                  onClick={() =>
                    navigate(
                      `/product/update/${product.id}`
                    )
                  }
                >
                  Update Product
                </button>

                <button
                  className="btn btn-danger"
                  onClick={handleDeleteProduct}
                >
                  Disable Product
                </button>
              </>
            )}

            {/* Back Button */}
            <button
              className="back-btn"
              onClick={() =>
                navigate(isAdmin ? "/admin" : "/")
              }
            >
              {isAdmin
                ? "Back to Dashboard"
                : "Back to Home"}
            </button>
          </div>
          <div className="reviews-section">

  <h3>
    ⭐ Rating: {Number(averageRating).toFixed(1)}
  </h3>

  {!isAdmin && !hasReviewed && (
    <div className="review-form">

      <h4>Write a Review</h4>

      <select
        value={rating}
        onChange={(e) =>
          setRating(Number(e.target.value))
        }
      >
        <option value="5">⭐⭐⭐⭐⭐</option>
        <option value="4">⭐⭐⭐⭐</option>
        <option value="3">⭐⭐⭐</option>
        <option value="2">⭐⭐</option>
        <option value="1">⭐</option>
      </select>

      <textarea
        value={comment}
        placeholder="Write your review..."
        onChange={(e) =>
          setComment(e.target.value)
        }
      />

      <button
        className="buy-btn"
        onClick={submitReview}
      >
        Submit Review
      </button>

    </div>
  )}
  {hasReviewed && !isAdmin && (

  <div className="reviewed-message">

    ✅ You already reviewed this product

  </div>

)}

  <div className="reviews-list">

    <h4>Customer Reviews</h4>

    {reviews.length === 0 ? (

      <p>No reviews yet.</p>

    ) : (

      reviews.map((review) => (

        <div
          key={review.id}
          className="review-card"
        >

          <div>
            {"⭐".repeat(review.rating)}
          </div>

          <p>{review.comment}</p>

          <small>
            {review.user?.name}
          </small>

        </div>
      ))
    )}

  </div>

</div>
        </div>
      </div>
      {recentProducts.length > 0 && (
<div className="recently-viewed-section">
  <div className="recently-viewed">

    <h2>
      ❤️ Recently Viewed
    </h2>

    <div
      className="recent-products-grid"
    >

     {recentProducts
  .filter(item => item)
  .map((item) => (

    <div
      key={item.id}
      className="recent-card"
        onClick={() =>
    navigate(`/product/${item.id}`)
  }
    >

      <img
        src={
          item.imageUrl ||
          "/placeholder-product.png"
        }
        alt={item.name}
        className="recent-product-image"
      />

      <h4>{item.name}</h4>

      <p>₹{item.price}</p>

    </div>

))}

    </div>

  </div>
  </div>

)}
    </div>
  );
};

export default Product;