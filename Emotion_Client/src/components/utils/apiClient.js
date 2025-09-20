import axios from "axios";
import { isTokenExpired, handleTokenExpiry } from "./authUtils";

const apiClient = axios.create({
  baseURL: "https://emotion-tracker-backend-n5vd.onrender.com/api",
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
