import axios from "axios";

const API = axios.create({
  baseURL: "https://shophub-backend-osmy.onrender.com/api",
});

/* =========================
   PUBLIC ENDPOINTS
========================= */

const publicEndpoints = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
   "/products",        // ✅ ADD
  "/product/", 
];

/* =========================
   REQUEST INTERCEPTOR
========================= */

API.interceptors.request.use(

  (config) => {

    const isPublicEndpoint =
      publicEndpoints.some(

        (endpoint) =>

          config.url?.startsWith(
            endpoint
          )
      );

    /* REMOVE AUTH FOR PUBLIC APIs */

    if (isPublicEndpoint) {

      if (
        config.headers?.Authorization
      ) {

        delete config.headers.Authorization;
      }

      return config;
    }

    /* ADD TOKEN */

    const token =
      sessionStorage.getItem(
        "token"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */

API.interceptors.response.use(

  (response) => response,

  (error) => {

    const status =
      error.response?.status;

    const currentPath =
      window.location.pathname;

    /* =========================
       PUBLIC PAGES
    ========================= */

    const publicPages = [

      "/login",

      "/register",

      "/forgot-password",

      "/reset-password",

      "/oauth-success",
    ];

    const isPublicPage =
      publicPages.includes(
        currentPath
      );

    /* =========================
       HANDLE 401
    ========================= */

    if (status === 401) {

      console.log(
        "401 Unauthorized"
      );

      const token =
        sessionStorage.getItem(
          "token"
        );

      /* ONLY LOGOUT
         IF TOKEN EXISTS */

      if (
        token &&
        !isPublicPage
      ) {

        console.log(
          "Removing expired token"
        );

        sessionStorage.removeItem(
          "token"
        );

        sessionStorage.removeItem(
          "role"
        );

        /* SMALL DELAY */

        setTimeout(() => {

          window.location.href =
            "/login";

        }, 100);
      }
    }

    /* =========================
       HANDLE 403
    ========================= */

    if (status === 403) {

      console.error(
        "Access denied."
      );
    }

    /* =========================
       HANDLE 500
    ========================= */

    if (status >= 500) {

      console.error(
        "Server error."
      );
    }

    return Promise.reject(error);
  }
);

export default API;