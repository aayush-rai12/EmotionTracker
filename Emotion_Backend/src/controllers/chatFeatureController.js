import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import emotionCardDetails from "../models/UsersEmotion.js";

const registerUserChats = async (req, res) => {
  try {
    const user_Id = req.params.user_Id;
    console.log(`Fetching chats for user: ${user_Id}`);

    // Mood to emoji mapping
    const moodEmojis = {
      'happy': '😊',
      'sad': '😢',
      'angry': '😡',
      'calm': '😌',
      'excited': '🤩',
      'loved': '❤️',
      'celebrating': '🥳',
      'anxious': '😰',
      'peaceful': '🧘',
      'No mood': '💭'
    };

    const currentUser = await User.findById(user_Id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all other users
    const users = await User.find({ _id: { $ne: user_Id } }, { password: 0, email: 0 });

    // For each user, get their latest emotion
    const usersWithEmotions = await Promise.all(
      users.map(async (user) => {
        const latestEmotion = await emotionCardDetails
          .findOne({ user_Id: user._id })
          .sort({ createdAt: -1 })
          .lean();

        const mood = latestEmotion?.mood || "No mood";
        return {
          ...user.toObject(),
          latestMood: mood,
          moodColor: latestEmotion?.moodColor || "#ccc",
          moodEmoji: moodEmojis[mood.toLowerCase()] || moodEmojis['No mood'],
          intensity: latestEmotion?.intensity || "N/A",
          feelings: latestEmotion?.feelings || "N/A",
        };
      })
    );

    // Get current user's latest emotion
    const currentUserLatestEmotion = await emotionCardDetails
      .findOne({ user_Id: user_Id })
      .sort({ createdAt: -1 })
      .lean();

    const currentUserMood = currentUserLatestEmotion?.mood || "No mood";
    const currentUserWithEmotion = {
      ...currentUser.toObject(),
      latestMood: currentUserMood,
      moodColor: currentUserLatestEmotion?.moodColor || "#ccc",
      moodEmoji: moodEmojis[currentUserMood.toLowerCase()] || moodEmojis['No mood'],
      intensity: currentUserLatestEmotion?.intensity || "N/A",
      feelings: currentUserLatestEmotion?.feelings || "N/A",
    };

    res.status(200).json({
      message: "Fetched all users for chat dashboard",
      status: true,
      currentUser: currentUserWithEmotion,
      users: usersWithEmotions,
    });
  } catch (error) {
    console.error("Error fetching user chats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default registerUserChats;