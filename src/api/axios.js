import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
});

// Har request me JWT token automatically attach karo agar login hai
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("eco_token");
  if (token) {
  localStorage.getItem("eco_token")
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 aane pe (token expire/invalid) auto-logout kar do
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("eco_token");
      localStorage.removeItem("eco_user");
    }
    return Promise.reject(error);
  }
);

export default api;
