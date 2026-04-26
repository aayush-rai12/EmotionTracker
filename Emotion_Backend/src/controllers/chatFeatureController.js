import mongoose from "mongoose";
import User from "../models/User.js";
import emotionCardDetails from "../models/UsersEmotion.js";
import Message from "../models/Message.js";

export const registerUserChats = async (req, res) => {
  try {
    const user_Id = req.params.user_Id;

    // Security check: Ensure the requester is asking for their own dashboard
    if (req.user.id !== user_Id) {
      return res.status(403).json({ message: "Unauthorized access to this user data." });
    }

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
      { $match: { _id: { $ne: mongoose.Types.ObjectId.createFromHexString(user_Id) } } },
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
      {
        $lookup: {
          from: "messages",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$senderId", "$$userId"] },
                    {
                      $eq: [
                        "$receiverId",
                        mongoose.Types.ObjectId.createFromHexString(user_Id),
                      ],
                    },
                    { $eq: ["$seen", false] },
                  ],
                },
              },
            },
            { $count: "count" },
          ],
          as: "unreadMessages",
        },
      },
      {
        $addFields: {
          unreadMessageCount: {
            $ifNull: [{ $arrayElemAt: ["$unreadMessages.count", 0] }, 0],
          },
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

    // Project only necessary fields (avoid sending sensitive data like email, password)
    pipeline.push({
      $project: {
        _id: 1,
        name: 1,
        profileImage: 1,
        computedMood: 1,
        isOnline: 1,
        latestEmotionData: 1,
        unreadMessageCount: 1,
      },
    });

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
      _id: currentUser._id,
      name: currentUser.name,
      profileImage: currentUser.profileImage,
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

// Chat controller code stared here
// chatFeatureController.js
export const createMessage = async ({ senderId, receiverId, text }) => {
  const newMessage = new Message({ senderId, receiverId, text });
  await newMessage.save();
  return newMessage;
};
// Send message (API based)
// export const sendMessage = async (req, res) => {
//   try {
//     const { senderId, receiverId, text } = req.body;

//     // Security check: The authenticated user must be the sender
//     if (req.user.id !== senderId) {
//       return res.status(403).json({ message: "Unauthorized. Sender ID must match the logged-in user." });
//     }

//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       text,
//     });

//     await newMessage.save();
//     res.status(201).json({
//       message: "Message sent successfully",
//       status: true,
//     });
//   } catch (error) {
//     console.error("Error sending message:", error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
// Get chat history between 2 users

export const getChatHistory = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user.id; // Automatically get from authenticated token

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required." });
    }

    // Explicitly cast to ObjectId
    const senderObjId = mongoose.Types.ObjectId.createFromHexString(senderId);
    const receiverObjId = mongoose.Types.ObjectId.createFromHexString(receiverId);

    // Mark messages as read
    await Message.updateMany(
      { senderId: receiverObjId, receiverId: senderObjId, seen: false },
      { $set: { seen: true } }
    );

    const messages = await Message.find({
      $or: [
        { senderId: senderObjId, receiverId: receiverObjId },
        { senderId: receiverObjId, receiverId: senderObjId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      message: "Chat history fetched successfully",
      status: true,
      messages,
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
