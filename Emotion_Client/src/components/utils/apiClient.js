import axios from "axios";
import { isTokenExpired, handleTokenExpiry } from "./authUtils";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

//Add a request interceptor to attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      if (isTokenExpired(token)) {
        handleTokenExpiry();
        // Request rejected with error
        return Promise.reject(
          new Error("Session expired. Please log in again.")
        );
      }

      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;//continue with request 
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default apiClient;
