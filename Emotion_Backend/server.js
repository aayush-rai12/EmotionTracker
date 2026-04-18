import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./src/config/db.js";
import bodyParser from "body-parser";
import userRoutes from "./src/routes/userRoutes.js";
import emotionRoutes from "./src/routes/userEmotion.js";
import chatFeatureRoutes from "./src/routes/chatFeatureRoutes.js";
import { Server } from "socket.io";
import { initSocket } from "./src/socket/socket.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// socket.io
import http from "http";
// create http server
const server = http.createServer(app);

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",") 
  : ["http://localhost:5173"];

// create socket.io server
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initSocket(io);

// Middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Emotion Tracker Backend is running");
});

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/userEmotion", emotionRoutes);
app.use("/api/chatFeature", chatFeatureRoutes);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});