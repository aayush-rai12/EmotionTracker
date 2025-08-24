import usersEmotion from "../models/UsersEmotion.js";
import bcrypt from "bcryptjs";

export const saveUserEmotion = async (req, res) => {
  try {
    const {
      user_Id,
      feelings,
      mood,
      moodColor,
      intensity,
      triggerReason,
      preferredActivity,
      partnerImpact,
    } = req.body;
    console.log("Saving user emotion:", req.body);

    // Logic to save the user's emotion data
    const newEmotion = new usersEmotion({
      user_Id,
      feelings,
      mood,
      moodColor,
      intensity,
      triggerReason,
      preferredActivity,
      partnerImpact,
    });

    await newEmotion.save();
    res
      .status(200)
      .json({ message: "User emotion saved successfully", data: newEmotion });
  } catch (error) {
    console.error("Error saving user emotion:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserEmotions = async (req, res) => {
  try {
    const user_Id = req.params.user_Id;
    console.log("Fetching emotions for user:", user_Id);

    // Validate user_Id
    if (!user_Id) {
      return res.status(400).json({ message: "Invalid user ID!" });
    }

    // Fetch user's emotion data
    const emotionData = await usersEmotion.find({ user_Id: user_Id });

    res.status(200).json({
      success: true,
      message: "User emotions fetched successfully",
      emotionData,
    });
  } catch (error) {
    console.error("Error fetching user emotions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateEmotionCard = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    console.log("Updating emotion card with ID:", id, "Data:", updateData);
    // Validate id
    if (!id) {
      return res.status(400).json({ message: "Invalid emotion card ID!" });
    }
    // Update the emotion card
    const updatedCard = await usersEmotion.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCard) { 
      return res.status(404).json({ message: "Emotion card not found!" });
    }
    res.status(200).json({
      success: true,
      message: "Emotion card updated successfully",
      updatedCard,
    });
  } catch (error) {
    console.error("Error updating emotion card:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteEmotionCard = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting emotion card with ID:", id);

    // Validate id
    if (!id) {
      return res.status(400).json({ message: "Invalid emotion card ID!" });
    }

    // Delete the emotion card
    const deletedCard = await usersEmotion.findByIdAndDelete(id);

    if (!deletedCard) {
      return res.status(404).json({ message: "Emotion card not found!" });
    }

    res.status(200).json({
      success: true,
      message: "Emotion card deleted successfully",
      deletedCard,
    });
  } catch (error) {
    console.error("Error deleting emotion card:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
