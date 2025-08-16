import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoDB = process.env.MONGO_URL_local || "mongodb://localhost:27017/EmotionTrackerDB";

mongoose.connect(mongoDB)

const db = mongoose.connection;

db.on("connected", () => {
  console.log('DB connected successfully');
});

db.on("error", () => {
  console.log('DB connection error');
});

db.on("disconnected", () => {
  console.log("MongoDB disconnected.");
});

export default mongoose;