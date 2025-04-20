import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://taskmanagerbackend-3ee1.onrender.com/docs/#/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ Токен отсутствует в localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;