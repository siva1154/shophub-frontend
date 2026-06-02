import "./App.css";

import React, {
  useState,
  useEffect
} from "react";

import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  ToastContainer
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

/* =========================
   COMPONENTS
========================= */

import Home from "./components/Home";

import OAuthSuccess
from "./components/OAuthSuccess";

import Navbar
from "./components/Navbar";

import Cart
from "./components/Cart";

import AddProduct
from "./components/AddProduct";

import Product
from "./components/Product";

import UpdateProduct
from "./components/UpdateProduct";

import AdminPromotions from "./components/AdminPromotions";

import Register
from "./components/Register";

import Login
from "./components/Login";

import AdminDashboard
from "./components/AdminDashboard";

import Profile
from "./components/Profile";

import AdminCoupons from "./components/AdminCoupons";

import EditProfile
from "./components/EditProfile";

import Orders
from "./components/Orders";

import Wishlist
from "./components/Wishlist";

import Addresses
from "./components/Addresses";

import Settings
from "./components/Settings";

import ForgotPassword
from "./components/ForgotPassword";

import ResetPassword
from "./components/ResetPassword";

/* =========================
   ROUTE GUARDS
========================= */

import PrivateRoute
from "./components/PrivateRoute";

import AdminRoute
from "./components/AdminRoute";

import VerifyRegistration
from "./components/VerifyRegistration";

/* =========================
   BOOTSTRAP
========================= */

import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap/dist/js/bootstrap.bundle.min.js";

/* =========================================
   APP CONTENT
========================================= */

function AppContent() {

  const [cart, setCart] =
    useState([]);

  const [selectedCategory,
    setSelectedCategory] =
    useState("");

  const [searchQuery,
    setSearchQuery] =
    useState("");

  /* =========================
     THEME
  ========================= */

  const [darkMode,
    setDarkMode] = useState(

    localStorage.getItem("theme")
      === "dark"
  );

  const location =
    useLocation();

  /* =========================
     HIDE NAVBAR
  ========================= */

  const hideNavbarRoutes = [

    "/login",

    "/register",

    "/admin",

    "/forgot-password",

    "/reset-password",

    "/verify-registration",
  ];

  const shouldShowNavbar =

    !hideNavbarRoutes.includes(
      location.pathname
    )

    &&

    !location.pathname.startsWith(
      "/product/update"
    );

  /* =========================
     APPLY THEME
  ========================= */

  useEffect(() => {

    const themeClass =
      darkMode
        ? "dark-theme"
        : "light-theme";

    document.body.classList.remove(
      "light-theme",
      "dark-theme"
    );

    document.body.classList.add(
      themeClass
    );

    localStorage.setItem(
      "theme",
      darkMode
        ? "dark"
        : "light"
    );

  }, [darkMode]);

  /* =========================
     CATEGORY FILTER
  ========================= */

  const handleCategorySelect =
    (category) => {

    setSelectedCategory(category);

    setTimeout(() => {

      window.scrollTo({

        top: 1200,

        behavior: "smooth",

      });

    }, 100);
  };

  /* =========================
     CART LOGIC
  ========================= */

  const addToCart = (
    product
  ) => {

    const existingProduct =
      cart.find(

        (item) =>
          item.id === product.id
      );

    if (existingProduct) {

      setCart(

        cart.map((item) =>

          item.id === product.id

            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }

            : item
        )
      );

    }

    else {

      setCart([

        ...cart,

        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  return (

    <>

      {/* =========================
          NAVBAR
      ========================= */}

      {shouldShowNavbar && (

        <Navbar

          onSelectCategory={
            handleCategorySelect
          }

          darkMode={darkMode}

          setDarkMode={setDarkMode}

          searchQuery={searchQuery}

          setSearchQuery={
            setSearchQuery
          }
        />
      )}

      {/* =========================
          ROUTES
      ========================= */}

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={

            <PrivateRoute>

              <Home

                addToCart={addToCart}

                selectedCategory={
                  selectedCategory
                }

                searchQuery={
                  searchQuery
                }

                onSelectCategory={
                  handleCategorySelect
                }
              />

            </PrivateRoute>
          }
        />

        {/* PRODUCT */}

        <Route
          path="/product"
          element={<Product />}
        />

        <Route
          path="/product/:id"
          element={<Product />}
        />

        {/* CART */}

        <Route
          path="/cart"
          element={

            <PrivateRoute>

              <Cart />

            </PrivateRoute>
          }
        />

        {/* AUTH */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
  path="/verify-registration"
  element={<VerifyRegistration />}
/>


        <Route
          path="/forgot-password"
          element={
            <ForgotPassword />
          }
        />

        <Route
          path="/reset-password"
          element={
            <ResetPassword />
          }
        />

        {/* OAUTH */}

        <Route
          path="/oauth-success"
          element={
            <OAuthSuccess />
          }
        />

        {/* PROFILE */}

        <Route
          path="/profile"
          element={

            <PrivateRoute>

              <Profile />

            </PrivateRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={

            <PrivateRoute>

              <EditProfile />

            </PrivateRoute>
          }
        />

        <Route
          path="/orders"
          element={

            <PrivateRoute>

              <Orders />

            </PrivateRoute>
          }
        />

        <Route
          path="/wishlist"
          element={

            <PrivateRoute>

              <Wishlist />

            </PrivateRoute>
          }
        />

        <Route
  path="/admin/coupons"
  element={
    <AdminRoute>
      <AdminCoupons />
    </AdminRoute>
  }
/>

        <Route
          path="/addresses"
          element={

            <PrivateRoute>

              <Addresses />

            </PrivateRoute>
          }
        />

        <Route
          path="/settings"
          element={

            <PrivateRoute>

              <Settings />

            </PrivateRoute>
          }
        />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={

            <AdminRoute>

              <AdminDashboard />

            </AdminRoute>
          }
        />
        <Route
  path="/admin/promotions"
  element={<AdminRoute><AdminPromotions /></AdminRoute>}
/>

        <Route
          path="/add_product"
          element={

            <AdminRoute>

              <AddProduct />

            </AdminRoute>
          }
        />

        <Route
          path="/product/update/:id"
          element={

            <AdminRoute>

              <UpdateProduct />

            </AdminRoute>
          }
        />

        {/* FALLBACK */}

        <Route
          path="*"
          element={
            <Navigate to="/login" />
          }
        />

      </Routes>

      {/* =========================
          TOAST
      ========================= */}

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

    </>
  );
}

/* =========================================
   APP
========================================= */

function App() {

  return <AppContent />;
}

export default App;