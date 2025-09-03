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
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserEmotions = async (req, res) => {
  try {
    const user_Id = req.params.user_Id;

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
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateEmotionCard = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
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
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteEmotionCard = async (req, res) => {
  try {
    const { id } = req.params;

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
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSupport = async (req, res) => {
  try {
    const _id = req.params.id //this is the card id;
    const {supportValues} = req.body;
    // Validate id
    if (!_id) {
      return res.status(400).json({ message: "Invalid emotion card ID!" });
    }
    // Update the support field of the emotion card
    const updatedCard = await usersEmotion.findByIdAndUpdate(_id, { Emotional_support:supportValues }, { new: true });
    if (!updatedCard) {
      return res.status(404).json({ message: "Emotion card not found!" });
    }
    res.status(200).json({
      success: true,
      message: "Support updated successfully",
      updatedCard,
    });
  }
  catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
