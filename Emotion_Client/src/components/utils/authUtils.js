import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// Check if JWT token is expired
export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);

    console.log("Decoded token:", decoded);
    console.log("Token expires at:", new Date(decoded.exp * 1000));
    if (!decoded.exp) return true;
    const now = Date.now() / 1000; // seconds
    return decoded.exp < now;
  } catch (e) {
    return true; // treat invalid token as expired
  }
};

// Handle logout on token expiry
export const handleTokenExpiry = () => {
  localStorage.clear();
  localStorage.setItem("sessionExpiredMessage", "Session expired, please log in again.");
  window.location.href = "/";
};

