import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Create a new instance of Google Generative AI with My API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Here will generate an AI-based suggestion based on our user's emotion details
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
     // Send prompt to Gemini
    const result = await model.generateContent(prompt);
    const suggestion = result.response.text();

    //Clean unwanted code blocks
    const cleaned = suggestion
      .replace(/```json\s*/g, "")
      .replace(/```/g, "")
      .trim();

    //Parse to JSON
    let cleanedSuggestion;
    try {
      cleanedSuggestion = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON Parse Error:", err.message);
      cleanedSuggestion = {
        suggestion: cleaned,
        songs_recommendation: "No songs available",
        songs: {}
      };
    }

    return cleanedSuggestion;
  } catch (error) {
    console.error("Error generating suggestions:", error.message);
    throw new Error("Failed to generate suggestion");
  }
};
