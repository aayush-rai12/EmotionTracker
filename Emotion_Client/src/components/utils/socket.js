import { io } from "socket.io-client";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Smart Fallback: If SOCKET_URL is missing, derive it from API_BASE_URL (remove /api)
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (API_BASE_URL ? API_BASE_URL.replace("/api", "") : "");

// create single socket instance
export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"], // Ensure websocket is tried first
});

socket.on("connect", () => {
  console.log("[Socket] Connected to server! ID:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("[Socket] Connection Error:", error.message);
});

socket.on("disconnect", (reason) => {
  console.warn("[Socket] Disconnected:", reason);
});