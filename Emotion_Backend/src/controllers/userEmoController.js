import usersEmotion from "../models/UsersEmotion.js";
import bcrypt from "bcryptjs";
import { generateSuggestions } from "../config/aiService.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

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
    const updatedCard = await usersEmotion.findByIdAndUpdate(id, updateData, {
      new: true,
    });
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
    const _id = req.params.id; //this is the card id;
    const { supportValues } = req.body;
    // Validate id
    if (!_id) {
      return res.status(400).json({ message: "Invalid emotion card ID!" });
    }
    // Update the support field of the emotion card
    const updatedCard = await usersEmotion.findByIdAndUpdate(
      _id,
      { Emotional_support: supportValues },
      { new: true }
    );
    if (!updatedCard) {
      return res.status(404).json({ message: "Emotion card not found!" });
    }
    res.status(200).json({
      success: true,
      message: "Support updated successfully",
      updatedCard,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const emmotionAiSuggestion = async (req, res) => {
  try {
    const { feeling, mood, triggered_reason, preferred_activity } = req.body;
    const aiResponse = await generateSuggestions({
      feeling,
      mood,
      triggered_reason,
      preferred_activity,
    });
    res.status(200).json({ suggestion: aiResponse });

    // this json for only testing
    // res.status(200).json({
    //   suggestion: {
    //     suggestion_quotes:
    //       "It's okay to feel angry about your career.  Try writing down your frustrations for 5 minutes – it can help process those feelings and prepare for a more productive conversation later.",
    //     songs_recommendation:
    //       "If you'd like, here are some songs that match your mood:",
    //     songs: {
    //       hindi: "Kabira - Yeh Jawaani Hai Deewani (Rekha Bharadwaj)",
    //       english: "Fix You - Coldplay",
    //       instrumental_or_trending: "Nuvole Bianche - Ludovico Einaudi",
    //     },
    //   },
    // });
    
  } catch (error) {
    res.status(500).json({ message: "Failed to generate suggestion" });
  }
};

export const getYoutubeLink = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query)
      return res.status(400).json({ error: "Song query is required" });
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          maxResults: 5, // thoda zyada results lao
          type: "video",
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    // check each video for embeddable status
    const videoIds = response.data.items.map((item) => item.id.videoId);

    const details = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "status",
          id: videoIds.join(","),
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );
    // console.log("details",details.data.items[0].status );
    // find first embeddable video
    const embeddableVideo = details.data.items.find(
      (v) => v.status.embeddable === true && v.status.privacyStatus === "public"
    );

    if (!embeddableVideo) {
      return res.status(404).json({ error: "No embeddable video found" });
    }
    const videoId = embeddableVideo.id;
    return res.json({ embedUrl: `https://www.youtube.com/embed/${videoId}` });
  } catch (error) {
    console.error("YouTube API error:", error.message);
    return res.status(500).json({ error: "Failed to fetch video" });
  }
};
