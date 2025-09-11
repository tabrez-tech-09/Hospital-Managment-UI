import axios, { InternalAxiosRequestConfig } from "axios";

// ✅ Create instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:9000", // Gateway or UserMS
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor: attach JWT
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor: handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        alert("Session expired! Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        alert(error.response.data?.message || "Something went wrong!");
      }
    } else {
      alert("Network error! Please check your connection.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;



