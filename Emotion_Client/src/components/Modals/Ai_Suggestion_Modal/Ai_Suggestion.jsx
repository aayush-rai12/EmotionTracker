import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaMagic, FaSpinner, FaLink } from "react-icons/fa";
import "./Ai_Suggestion.css";
import apiClient from "../../utils/apiClient";

const AiSuggestionModal = ({ show, handleAiModalClose, selectedAiCard, userName }) => {
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSongEmbed, setSelectedSongEmbed] = useState(null);
  const [loadingSong, setLoadingSong] = useState(false);

  useEffect(() => {
    if (selectedAiCard && show) {
      const detailsForAiSuggestion = {
        feeling: selectedAiCard.feelings || "N/A",
        mood: selectedAiCard.mood || "N/A",
        triggered_reason: selectedAiCard.triggerReason || "N/A",
        preferred_activity: selectedAiCard.preferredActivity || "N/A",
      };

      const getAisuggestion = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await apiClient.post(
            `/userEmotion/emmotionAiSuggestion`,
            detailsForAiSuggestion
          );
          setAiSuggestion(response.data.suggestion);
        } catch (err) {
          setError("Sorry, you've reached your daily suggestion limit!");
        } finally {
          setLoading(false);
        }
      };

      getAisuggestion();
    } else {
      // Reset when modal closes or no card selected
      setAiSuggestion(null);
      setError(null);
      setLoading(false);
    }
  }, [selectedAiCard, show]);

  const getMoodBasedGreeting = () => {
      if (!selectedAiCard?.mood) return "Hello";
      
      const mood = selectedAiCard.mood.toLowerCase();
      
      if (mood.includes('happy') || mood.includes('excited') || mood.includes('good')) {
        return "Hey there amazing";
      } else if (mood.includes('sad') || mood.includes('down') || mood.includes('low')) {
        return "Hello dear";
      } else if (mood.includes('angry') || mood.includes('frustrated')) {
        return "Hello";
      } else if (mood.includes('calm') || mood.includes('peaceful')) {
        return "Lovely to see you";
      } else {
        return "Hello";
      }
  };

  const fetchSongLink = async (songQuery) => {
    setLoadingSong(true);
    setSelectedSongEmbed(null); 
    
    try {
      const res = await apiClient.post(`/userEmotion/getYoutubeLink`,{ query: songQuery });
      setSelectedSongEmbed(res.data.embedUrl);
    } catch (error) {
      console.error("Failed to load song link", error);
      setSelectedSongEmbed(null);
    } finally{
      setLoadingSong(false);
    }
  };

  return (
    <Modal
      id="ai_modal"
      className="ai_modal"
      show={show}
      onHide={handleAiModalClose}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="ai_modal_title">
          <FaMagic style={{ color: "#886efbff", marginRight: "8px" }} />
          AI Suggestions:
          <span className="ai-user-greeting">
            {getMoodBasedGreeting()} {userName}!
          </span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body id="ai_modal_body">
        {loading && (
          <div className="ai-loading-state">
            <FaSpinner className="spinner-icon" />
            <p>Getting AI suggestions...</p>
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && aiSuggestion && (
          <div className="ai-suggestion-content">
            <h5>Suggestion Quote - Based on your feeling and current mood</h5>
            <p className="suggestion-quotes">{aiSuggestion.suggestion_quotes}</p>

            <h5>{aiSuggestion.songs_recommendation}</h5>
            <ul className="songs-list">
              {aiSuggestion.songs.hindi && (
                <li>
                  <div className="song-item">
                    <div className="song-info">
                      <strong>Hindi:</strong> {aiSuggestion.songs.hindi}
                    </div>
                    <button className="ai-sugg-link-button" onClick={()=>fetchSongLink(aiSuggestion.songs.hindi)}>
                      <FaLink /> Get Link
                    </button>
                  </div>
                </li>
              )}
              {aiSuggestion.songs.english && (
                <li>
                  <div className="song-item">
                    <div className="song-info">
                      <strong>English:</strong> {aiSuggestion.songs.english}
                    </div>
                    <button className="ai-sugg-link-button" onClick={()=>fetchSongLink(aiSuggestion.songs.english)}>
                      <FaLink /> Get Link
                    </button>
                  </div>
                </li>
              )}
              {aiSuggestion.songs.instrumental_or_trending && (
                <li>
                  <div className="song-item">
                    <div className="song-info">
                      <strong>Instrumental/Trending:</strong> {aiSuggestion.songs.instrumental_or_trending}
                    </div>
                    <button className="ai-sugg-link-button" onClick={()=>fetchSongLink(aiSuggestion.songs.instrumental_or_trending)}>
                      <FaLink /> Get Link
                    </button>
                  </div>
                </li>
              )}
            </ul>
            {loadingSong && <p>Loading song...</p>}

              {selectedSongEmbed && (
                <div className="song-iframe-container">
                  <iframe
                    width="100%"
                    height="250"
                    src={selectedSongEmbed}
                    title="YouTube player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
          </div>
        )}

        {!loading && !error && !aiSuggestion && (
          <p>No suggestions available at the moment.</p>
        )}
      </Modal.Body>

      <Modal.Footer className="ai-footer-sec">
        <div className="footer-note">
          <small>Powered by AI • Suggestions are personalized based on your emotions details</small>
        </div>
        <Button
          id="ai_close_btn"
          className="ai_close_btn btn-secondary"
          onClick={handleAiModalClose}
          disabled={loading}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AiSuggestionModal;