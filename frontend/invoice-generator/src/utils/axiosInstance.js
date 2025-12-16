// import axios from "axios";
// import { BASE_URL } from "./apiPaths";
// //import Login from "../pages/Auth/Login";

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   timeout: 80000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// // Request Interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem("token");

//     if (accessToken) {
//       // Ensure headers object exists
//       config.headers = config.headers || {};
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response Interceptor
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle common errors globally
//     if (error.response) {
//       if (error.response.status === 500) {
//         console.error("Server error. Please try again later.");
//       }
//     } else if (error.code === "ECONNABORTED") {
//       console.error("Request timeout. Please try again.");
//     }

//     return Promise.reject(error);
//   }
// );
// export default axiosInstance;
import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // THE ONLY CHANGE IS HERE ↓↓↓
    const accessToken =
      localStorage.getItem("token") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.token;
    // THE ONLY CHANGE IS ABOVE ↑↑↑

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 500) {
        console.error("Server error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
