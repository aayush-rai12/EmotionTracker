import React, { useEffect, useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaMagic, FaSpinner, FaLink, FaMusic } from "react-icons/fa";
import "./Ai_Suggestion.css";
import apiClient from "../../utils/apiClient";

const AiSuggestionModal = ({ show, handleAiModalClose, selectedAiCard, userName }) => {
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSongEmbed, setSelectedSongEmbed] = useState(null);
  const [loadingSong, setLoadingSong] = useState(false);
  const [activeSongType, setActiveSongType] = useState(null);

  // Refs for auto-scroll
  const videoContainerRef = useRef(null);
  const modalBodyRef = useRef(null);

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
      setSelectedSongEmbed(null);
      setActiveSongType(null);
    }
  }, [selectedAiCard, show]);

  // Auto-scroll when video loads
  useEffect(() => {
    if (selectedSongEmbed && videoContainerRef.current) {
      // Small delay to ensure the iframe is rendered
      setTimeout(() => {
        videoContainerRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    }
  }, [selectedSongEmbed]);

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

  const fetchSongLink = async (songQuery, songType) => {
    setLoadingSong(true);
    setActiveSongType(songType);
    setSelectedSongEmbed(null);
    
    try {
      const res = await apiClient.post(`/userEmotion/getYoutubeLink`, { query: songQuery });
      setSelectedSongEmbed(res.data.embedUrl);
    } catch (error) {
      console.error("Failed to load song link Request");
      setSelectedSongEmbed(null);
    } finally {
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
      scrollable
    >
      <Modal.Header closeButton className="ai-modal-header">
        <Modal.Title id="ai_modal_title">
          <FaMagic className="magic-icon" />
          AI Suggestions:
          <span className="ai-user-greeting">
            {getMoodBasedGreeting()} {userName}!
          </span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body id="ai_modal_body" ref={modalBodyRef}>
        {loading && (
          <div className="ai-loading-state">
            <FaSpinner className="spinner-icon" />
            <p>Getting AI suggestions...</p>
          </div>
        )}

        {error && (
          <div className="ai-error-message">
            {error}
          </div>
        )}

        {!loading && !error && aiSuggestion && (
          <div className="ai-suggestion-content">
            <h5 className="section-title">Suggestion Quote - Based on your feeling and current mood</h5>
            <p className="suggestion-quotes">{aiSuggestion.suggestion_quotes}</p>

            <div className="music-section">
              <h5 className="music-section-title">
                <FaMusic className="music-icon" />
                {aiSuggestion.songs_recommendation || "Songs matching your mood"}
              </h5>
              
              <div className="songs-row">
                {aiSuggestion.songs.hindi && (
                  <div className="song-card">
                    <div className="song-header">
                      <span className="song-badge hindi-badge">Hindi</span>
                    </div>
                    <div className="song-info">
                      <p className="song-title">{aiSuggestion.songs.hindi}</p>
                    </div>
                    <button 
                      className={`ai-sugg-link-button ${activeSongType === 'hindi' ? 'active' : ''}`}
                      onClick={() => fetchSongLink(aiSuggestion.songs.hindi, 'hindi')}
                      disabled={loadingSong && activeSongType === 'hindi'}
                    >
                      {loadingSong && activeSongType === 'hindi' ? (
                        <FaSpinner className="spinner-icon-small" />
                      ) : (
                        <FaLink />
                      )}
                      Get Link
                    </button>
                  </div>
                )}

                {aiSuggestion.songs.english && (
                  <div className="song-card">
                    <div className="song-header">
                      <span className="song-badge english-badge">English</span>
                    </div>
                    <div className="song-info">
                      <p className="song-title">{aiSuggestion.songs.english}</p>
                    </div>
                    <button 
                      className={`ai-sugg-link-button ${activeSongType === 'english' ? 'active' : ''}`}
                      onClick={() => fetchSongLink(aiSuggestion.songs.english, 'english')}
                      disabled={loadingSong && activeSongType === 'english'}
                    >
                      {loadingSong && activeSongType === 'english' ? (
                        <FaSpinner className="spinner-icon-small" />
                      ) : (
                        <FaLink />
                      )}
                      Get Link
                    </button>
                  </div>
                )}

                {aiSuggestion.songs.instrumental_or_trending && (
                  <div className="song-card">
                    <div className="song-header">
                      <span className="song-badge instrumental-badge">Instrumental/Trending</span>
                    </div>
                    <div className="song-info">
                      <p className="song-title">{aiSuggestion.songs.instrumental_or_trending}</p>
                    </div>
                    <button 
                      className={`ai-sugg-link-button ${activeSongType === 'instrumental' ? 'active' : ''}`}
                      onClick={() => fetchSongLink(aiSuggestion.songs.instrumental_or_trending, 'instrumental')}
                      disabled={loadingSong && activeSongType === 'instrumental'}
                    >
                      {loadingSong && activeSongType === 'instrumental' ? (
                        <FaSpinner className="spinner-icon-small" />
                      ) : (
                        <FaLink />
                      )}
                      Get Link
                    </button>
                  </div>
                )}
              </div>
            </div>

            {loadingSong && (
              <div className="song-loading-state">
                <FaSpinner className="spinner-icon" />
                <p>Loading song preview...</p>
              </div>
            )}

            {selectedSongEmbed && (
              <div 
                className="song-iframe-container" 
                ref={videoContainerRef}
                id="video-player-section"
              >
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
          <div className="no-suggestions">
            <p>No suggestions available at the moment.</p>
          </div>
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