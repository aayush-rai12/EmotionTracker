import mongoose from "mongoose";
import User from "../models/User.js";
import emotionCardDetails from "../models/UsersEmotion.js";

const registerUserChats = async (req, res) => {
  try {
    const user_Id = req.params.user_Id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const filter = req.query.filter || "all";
    const skipIndex = (page - 1) * limit;

    const moodEmojis = {
      happy: "😊",
      sad: "😢",
      angry: "😡",
      calm: "😌",
      excited: "🤩",
      loved: "❤️",
      celebrating: "🥳",
      anxious: "😰",
      peaceful: "🧘",
      "No mood": "💭",
    };

    const currentUser = await User.findById(user_Id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Aggregation pipeline to handle sorting and searching by latest emotion
    const pipeline = [
      { $match: { _id: { $ne: new mongoose.Types.ObjectId(user_Id) } } },
      {
        $lookup: {
          from: "user_emotion_details",
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$user_Id", "$$userId"] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
          ],
          as: "latestEmotion",
        },
      },
      {
        $addFields: {
          latestEmotionData: { $arrayElemAt: ["$latestEmotion", 0] },
        },
      },
      {
        $addFields: {
          computedMood: { $ifNull: ["$latestEmotionData.mood", "No mood"] },
          // Mock online status - any fake user generated with streak > 5 will show as online
          isOnline: { $gt: ["$currentStreak", 5] },
        },
      },
    ];

    // Search Match
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { computedMood: { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    // Filter Match
    if (filter === "online") pipeline.push({ $match: { isOnline: true } });
    if (filter === "offline") pipeline.push({ $match: { isOnline: false } });

    // Count Total (ignoring skip/limit) for pagination
    const countResult = await User.aggregate([
      ...pipeline,
      { $count: "total" },
    ]);
    const totalUsers = countResult.length > 0 ? countResult[0].total : 0;

    // Apply Pagination
    pipeline.push({ $skip: skipIndex });
    pipeline.push({ $limit: limit });

    const paginatedUsers = await User.aggregate(pipeline);

    // Format Users Array
    const usersWithEmotions = paginatedUsers.map((user) => {
      const mood = user.computedMood;
      return {
        ...user,
        latestMood: mood,
        moodColor: user.latestEmotionData?.moodColor || "#ccc",
        moodEmoji: moodEmojis[mood.toLowerCase()] || moodEmojis["No mood"],
        intensity: user.latestEmotionData?.intensity || "N/A",
        feelings: user.latestEmotionData?.feelings || "N/A",
      };
    });

    // Format Current User
    const currentUserLatestEmotion = await emotionCardDetails
      .findOne({ user_Id: user_Id })
      .sort({ createdAt: -1 })
      .lean();

    const currentUserMood = currentUserLatestEmotion?.mood || "No mood";
    const currentUserWithEmotion = {
      ...currentUser.toObject(),
      latestMood: currentUserMood,
      moodColor: currentUserLatestEmotion?.moodColor || "#ccc",
      moodEmoji:
        moodEmojis[currentUserMood.toLowerCase()] || moodEmojis["No mood"],
      intensity: currentUserLatestEmotion?.intensity || "N/A",
      feelings: currentUserLatestEmotion?.feelings || "N/A",
    };

    res.status(200).json({
      message: "Fetched all users for chat dashboard",
      status: true,
      currentUser: currentUserWithEmotion,
      users: usersWithEmotions,
      hasMore: skipIndex + usersWithEmotions.length < totalUsers,
      totalUsers,
    });
  } catch (error) {
    console.error("Error fetching user chats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default registerUserChats;
