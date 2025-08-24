import mongoose from "mongoose";

const emotionTableSchema = new mongoose.Schema(
  {
    user_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feelings: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      required: true,
    },
    moodColor: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    partnerReacted: {
      type: Boolean,
      default: false,
    },
    intensity: {
      type: String,
      enum: ["Low", "Moderate", "High", "Very High", "Very Low"],
      required: true,
    },
    triggerReason: {
      type: String,
      required: true,
    },
    preferredActivity: {
      type: String,
    },
  },
  {
    timestamps: true, // Handles createdAt and updatedAt automatically
  }
);

const emotionCardDetails = mongoose.model("user_emotion_details", emotionTableSchema);

export default emotionCardDetails;
