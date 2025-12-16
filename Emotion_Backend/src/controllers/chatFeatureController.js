import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const registerUserChats = async (req, res) => {
  try {
    const user_Id = req.params.user_Id;
    console.log(`Fetching chats for user: ${user_Id}`);

    const currentUser = await User.findById(user_Id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const users = await User.find({ _id: { $ne: user_Id } }, { password: 0, email: 0 });

    res.status(200).json({
      message: "Fetched all users for chat dashboard",
      status: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching user chats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default registerUserChats;