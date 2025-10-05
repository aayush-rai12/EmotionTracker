import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const fallbackSuggestionsByMood = {
  sad: {
    suggestion_quotes: "It’s okay to feel sad sometimes. Try listening to a calming song or journaling your thoughts for a few minutes.",
    songs_recommendation: "Here are some soothing songs for you:",
    songs: {
      hindi: "Tujhe Kitna Chahne Lage - Arijit Singh",
      english: "Someone Like You - Adele",
      instrumental_or_trending: "Weightless - Marconi Union"
    }
  },
  Peaceful: {
    suggestion_quotes: "Take a short break and try some deep breathing or a quick walk to ease your stress.",
    songs_recommendation: "These songs might help you relax:",
    songs: {
      hindi: "Shanti Shanti - Anuradha Paudwal",
      english: "Let It Be - The Beatles",
      instrumental_or_trending: "Clair de Lune - Debussy"
    }
  },
  anxious: {
    suggestion_quotes: "Try grounding yourself by focusing on your breath or doing a 5-minute mindfulness exercise.",
    songs_recommendation: "Here are some calming and grounding songs:",
    songs: {
      hindi: "Phir Le Aaya Dil - Rekha Bhardwaj",
      english: "Breathe Me - Sia",
      instrumental_or_trending: "Ambient Relaxation Mix"
    }
  },
  happy: {
    suggestion_quotes: "Enjoy your good mood by dancing to your favorite energetic song or sharing your happiness with someone.",
    songs_recommendation: "Keep the energy high with these tracks:",
    songs: {
      hindi: "Gallan Goodiyan - Dil Dhadakne Do",
      english: "Happy - Pharrell Williams",
      instrumental_or_trending: "Uplifting Pop Instrumental"
    }
  },
  default: {
    suggestion_quotes: "Take a moment to breathe and do something that makes you smile.",
    songs_recommendation: "Here are some songs that might brighten your day:",
    songs: {
      hindi: "Zinda - Siddharth Mahadevan",
      english: "Here Comes The Sun - The Beatles",
      instrumental_or_trending: "River Flows in You - Yiruma"
    }
  }
};

export const generateSuggestions = async (data) => {
  const { feeling, mood, triggered_reason, preferred_activity } = data;

  const prompt = `
                  You are an empathetic mental wellness assistant.

                  A user has shared the following emotional state:
                  - Feeling: ${feeling}
                  - Mood: ${mood}
                  - Triggered Reason: ${triggered_reason}
                  - Preferred Activity: ${preferred_activity}

                  Your task:
                  1. Understand their emotions deeply and respond with kindness.
                  2. Suggest a short, **realistic and actionable activity** that they can do right now to feel better.
                  3. If possible, connect your suggestion to their preferred activity.
                  4. Suggest **three song options** based on their emotional state:
                    - If they are sad or stressed → suggest a calming, hopeful, or uplifting song.
                    - If they are anxious → suggest a motivational, grounding, or relaxing song.
                    - If they are happy → suggest a cheerful or energetic song to maintain their good mood.
                    - Always pick a song that feels relevant to their context (feeling + mood + trigger + activity). 
                  5. Pick songs according to their emotional state:
                    - If they are sad or stressed → suggest a calming, hopeful, or uplifting song.
                    - If they are anxious → suggest a motivational, grounding, or relaxing song.
                    - If they are happy → suggest a cheerful or energetic song to maintain their good mood.
                    - Always pick a song that feels relevant to their context (feeling + mood + trigger + activity).
                  6. Keep your response encouraging, supportive, and under 2 sentences.

                 Respond ONLY in pure JSON format (no code blocks, no extra text) with the following keys:
                  
                    {
                      "suggestion_quotes": "<your helpful and actionable suggestion here>",
                      "songs_recommendation": "If you'd like, here are some songs that match your mood:",
                      "songs": {
                        "hindi": "<hindi song name - artist>",
                        "english": "<english song name - artist>",
                        "instrumental_or_trending": "<global/trending instrumental or feel-good song>"
                      }
                    }

  `;

  try {
    //here I used gemini-1.5-flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    
    // Alternative models you can try:
    // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    // const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    
     // Send prompt to Gemini
    const result = await model.generateContent(prompt);
    const suggestion = result.response.text();

    //Clean unwanted code blocks
    const cleaned = suggestion.replace(/```json\s*/g, "").replace(/```/g, "").trim();

    //Parse to JSON
    let cleanedSuggestion;
    try {
      cleanedSuggestion = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON Parse Error:", err.message);

      // Fallback based on mood
      cleanedSuggestion = fallbackSuggestionsByMood[mood?.toLowerCase()] || fallbackSuggestionsByMood.default;
    }
    return cleanedSuggestion;
  } catch (error) {
    console.error("Error generating suggestions:", error.message);

    // Fallback based on mood
    return fallbackSuggestionsByMood[mood?.toLowerCase()] || fallbackSuggestionsByMood.default;
  }
};
