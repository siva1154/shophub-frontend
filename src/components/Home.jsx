import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import API from "../api/axios";
import AppContext from "../Context/Context";

import unplugged from "../assets/unplugged.png";

import "../styles/home.css";

import HeroSection from "./HeroSection";
import CategorySection from "./CategorySection";
import WhyChooseUs from "./WhyChooseUs";
import Newsletter from "./Newsletter";

import { toast } from "react-toastify";

const Home = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
}) => {
  const {
    data,
    isError,
    addToCart,
    refreshData,
  } = useContext(AppContext);

  const [products, setProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] =useState("ALL");
  const [priceRange, setPriceRange] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");

  const [isDataFetched, setIsDataFetched] =
    useState(false);

  /* ==========================================
     FETCH PRODUCTS
  ========================================== */
  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  /* ==========================================
     FETCH PRODUCT IMAGES
  ========================================== */
  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts =
        async () => {
          const updatedProducts =
            await Promise.all(
              data.map(async (product) => {
                try {
                  const response =
                    await API.get(
                      `/product/${product.id}/image`,
                      {
                        responseType: "blob",
                      }
                    );

                  const imageUrl =
                    URL.createObjectURL(
                      response.data
                    );

                  return {
                    ...product,
                    imageUrl,
                  };
                } catch (error) {
                  console.error(
                    "Error fetching image:",
                    error
                  );

                  return {
                    ...product,
                    imageUrl: unplugged,
                  };
                }
              })
            );

          setProducts(updatedProducts);
        };

      fetchImagesAndUpdateProducts();
    }
  }, [data]);

  /* ==========================================
     ADD TO WISHLIST
  ========================================== */
  const addToWishlist = async (
    productId,
    productName
  ) => {
    try {
      await API.post(
        `/wishlist/${productId}`
      );

      toast.success(
        `${productName} added to wishlist ❤️`
      );
    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );

      toast.error(
        "Could not add item to wishlist"
      );
    }
  };

  /* ==========================================
     FILTER PRODUCTS
  ========================================== */
  const brands = [
  "ALL",
  ...new Set(
    products.map(
      (product) => product.brand
    )
  ),
];
 const filteredProducts =
  products.filter((product) => {

    const matchesCategory =
      selectedCategory === "ALL" ||
      !selectedCategory ||
      product.category
        ?.toLowerCase()
        .includes(
          selectedCategory.toLowerCase()
        );

    const matchesSearch =
      product.name
        ?.toLowerCase()
        .includes(
          searchQuery?.toLowerCase() || ""
        ) ||
      product.brand
        ?.toLowerCase()
        .includes(
          searchQuery?.toLowerCase() || ""
        ) ||
      product.category
        ?.toLowerCase()
        .includes(
          searchQuery?.toLowerCase() || ""
        );

    const matchesBrand =
      selectedBrand === "ALL" ||
      product.brand === selectedBrand;

    let matchesPrice = true;

    if (priceRange === "UNDER1000") {

      matchesPrice =
        product.price < 1000;

    } else if (
      priceRange === "1000TO5000"
    ) {

      matchesPrice =
        product.price >= 1000 &&
        product.price <= 5000;

    } else if (
      priceRange === "ABOVE5000"
    ) {

      matchesPrice =
        product.price > 5000;
    }

    let matchesStock = true;

    if (stockFilter === "INSTOCK") {

      matchesStock =
        product.stockQuantity > 0;

    } else if (
      stockFilter === "OUTOFSTOCK"
    ) {

      matchesStock =
        product.stockQuantity <= 0;
    }

    return (
      matchesCategory &&
      matchesSearch &&
      matchesBrand &&
      matchesPrice &&
      matchesStock
    );
  });

  /* ==========================================
     ERROR UI
  ========================================== */
  if (isError) {
    return (
      <div
        className="text-center"
        style={{ padding: "18rem" }}
      >
        <img
          src={unplugged}
          alt="Error"
          style={{
            width: "100px",
            height: "100px",
          }}
        />
      </div>
    );
  }

  /* ==========================================
     UI
  ========================================== */
  return (
    <div className="home-container">
      {/* HERO */}
      <HeroSection />

      {/* CATEGORY SECTION */}
      <CategorySection
        onSelectCategory={
          onSelectCategory
        }
      />

      {/* WHY CHOOSE US */}
      <WhyChooseUs />

<div className="filters-bar">

  <select
    value={selectedBrand}
    onChange={(e) =>
      setSelectedBrand(e.target.value)
    }
  >
    {brands.map((brand) => (
      <option
        key={brand}
        value={brand}
      >
        {brand}
      </option>
    ))}
  </select>

  <select
    value={priceRange}
    onChange={(e) =>
      setPriceRange(e.target.value)
    }
  >
    <option value="ALL">
      All Prices
    </option>

    <option value="UNDER1000">
      Under ₹1000
    </option>

    <option value="1000TO5000">
      ₹1000 - ₹5000
    </option>

    <option value="ABOVE5000">
      Above ₹5000
    </option>
  </select>

  <select
    value={stockFilter}
    onChange={(e) =>
      setStockFilter(e.target.value)
    }
  >
    <option value="ALL">
      All Products
    </option>

    <option value="INSTOCK">
      In Stock
    </option>

    <option value="OUTOFSTOCK">
      Out Of Stock
    </option>
  </select>

</div>
      {/* PRODUCTS */}
      {filteredProducts.length === 0 ? (
        <h2 className="no-products">
          No Products Available
        </h2>
      ) : (
        
        <div className="product-grid">
          {filteredProducts.map(
            (product) => {
              const {
                id,
                brand,
                name,
                price,
                productAvailable,
                imageUrl,
              } = product;

              return (
                <div
                  className="product-card"
                  key={id}
                >
                  {/* WISHLIST */}
                  <button
                    className="wishlist-btn"
                    onClick={(e) => {
                      e.preventDefault();

                      addToWishlist(
                        id,
                        name
                      );
                    }}
                  >
                    ❤️
                  </button>

                  <Link
                    to={`/product/${id}`}
                    className="product-link"
                  >
                    {/* IMAGE */}
                    <div className="image-container">
                      <img
                        src={imageUrl}
                        alt={name}
                      />
                    </div>

                    {/* INFO */}
                    <div className="product-info">
                      <h3>{name}</h3>

                      <p className="brand">
                        {brand}
                      </p>

                      <div className="price">
                        ₹{price}
                      </div>
                    </div>

                    {/* BUTTON */}
                    <button
                      className="add-cart-btn"
                      onClick={(e) => {
                        e.preventDefault();

                        addToCart(product);

                        toast.success(
                          `${product.name} added to cart 🛒`
                        );
                      }}
                     disabled={product.stockQuantity <= 0}
                    >
                      {product.stockQuantity > 0
                        ? "Add to Cart"
                        : "Out of Stock"}
                    </button>
                  </Link>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* NEWSLETTER */}
      <Newsletter />
    </div>
  );
};

export default Home;