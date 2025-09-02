import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Form, Row, Col, FloatingLabel } from "react-bootstrap";
import { Clipboard } from "lucide-react";
import "./emotionModal.css";
import apiClient from "../../utils/apiClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  

const moods = [
  { label: "Happy", emoji: "😊", color: "#FF9E6D" },
  { label: "Sad", emoji: "😢", color: "#6DA9FF" },
  { label: "Angry", emoji: "😡", color: "#FF6B6B" },
  { label: "Calm", emoji: "😌", color: "#6DDBAA" },
  { label: "Excited", emoji: "🤩", color: "#FF6BB5" },
  { label: "Loved", emoji: "❤️", color: "#FF6B9D" },
  { label: "Celebrating", emoji: "🥳", color: "#FFCE6D" },
  { label: "Anxious", emoji: "😰", color: "#9D6DFF" },
  { label: "Peaceful", emoji: "🧘", color: "#6DDBD4" },
];

const triggerOptions = [
  {
    category: "🧡 Romantic / Partner Specific",
    triggers: [
      "They smiled at you",
      "Their voice",
      "The way they looked at you",
      "The way they talk",
      "Their laugh",
      "Their hugs",
      "Their kisses",
      "Their scent",
      "Their touch",
      "When they held your hand",
      "When they surprised you",
      "They noticed the small things",
      "When they stood up for you",
      "When they said something deep",
      "When they opened up emotionally",
      "When they cooked or made something for you",
    ],
  },
  {
    category: "👪 Family / Social",
    triggers: [
      "Papa ki daant",
      "Maa ka pyar",
      "Friend's unexpected support",
      "Sibling teasing you playfully",
      "When a friend shared your happiness",
    ],
  },
  {
    category: "🌧️ Situational / Reflective",
    triggers: [
      "Woke up to peaceful weather",
      "Felt alone in a crowd",
      "Old memory triggered by a song",
      "Saw a couple in love",
      "Random act of kindness",
      "Got emotional after watching a movie",
      "Read a message that hit you deeply",
      "Felt lost in thoughts",
      "Someone genuinely listened to you",
    ],
  },
  {
    category: "🚀 Growth / Self-love",
    triggers: [
      "Completed a long-pending task",
      "Received unexpected praise",
      "You spoke your heart out",
      "Took a break for yourself",
      "Looked in the mirror and smiled",
    ],
  },
];

const EmotionModal = ({ show, handleClose, fetchEmotionData, editItem }) => {
  const [feeling, setFeeling] = useState("");
  const [mood, setMood] = useState(null);
  const [intensity, setIntensity] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [customTrigger, setCustomTrigger] = useState("");
  const [trigger, setTrigger] = useState("");
  const [preferredActivity, setPreferredActivity] = useState("");
  const [partnerReaction, setPartnerReaction] = useState("");
  const [loading, setLoading] = useState(false);

  const maxChars = 250;
  const emojiContainerRef = useRef(null);

  useEffect(() => {
    if (editItem) {
      setFeeling(editItem.feelings || "");
      setMood(moods.find((m) => m.label === editItem.mood) || null);
      setIntensity(editItem.intensity || "");
      setPreferredActivity(editItem.preferredActivity || "");
      setPartnerReaction(editItem.partnerImpact || "");

      const allTriggers = triggerOptions.flatMap((g) => g.triggers);
      if (allTriggers.includes(editItem.triggerReason)) {
        setSelectedOption(editItem.triggerReason);
        setCustomTrigger("");
      } else {
        setSelectedOption("Custom");
        setCustomTrigger(editItem.triggerReason || "");
      }
    }
  }, [editItem]);

  useEffect(() => {
    if (!show) {
      // Reset form
      setFeeling("");
      setMood(null);
      setIntensity("");
      setSelectedOption("");
      setCustomTrigger("");
      setPreferredActivity("");
      setPartnerReaction("");
    }
  }, [show]);

  const handleSubmit = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("User not authenticated");
      return;
    }

    // Basic validation
    if (!feeling || !mood || !intensity) {
      alert("Please fill in all required fields (Feeling, Mood, Intensity).");
      return;
    }

    const triggerReason =
      selectedOption === "Custom" ? customTrigger.trim() : selectedOption;

    const emotionData = {
      user_Id: userId,
      feelings: feeling.trim(),
      mood: mood?.label || "",
      moodColor: mood?.color || "#FF9E6D",
      intensity,
      triggerReason,
      preferredActivity: preferredActivity.trim(),
      partnerImpact: partnerReaction.trim(),
    };

    try {
      setLoading(true);
      let response;
      if (editItem?._id) {
        // alert("Editing existing feeling...");
        response = await apiClient.patch(`/userEmotion/updateEmotionCard/${editItem._id}`,{ ...emotionData, _id: editItem._id });
      } else {
        response = await apiClient.post("/userEmotion/saveUserEmotion",emotionData);
      }
      if (response.status === 200) {
        toast.success(`Feeling ${editItem?._id ? "updated" : "saved"} successfully!`);
        await fetchEmotionData();
        handleClose();
      } else {
        toast.error("Failed to save feeling. Please try again.");
      }
    } catch (error) {
      console.error("Save failed:", error.response?.data || error.message);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="feel_bg-gradient"
      style={{
        background: mood?.color
          ? `linear-gradient(135deg, ${mood.color}20 0%, #ffffff 100%)`
          : "rgba(0, 0, 0, 0.5)",
        transition: "background 0.3s ease-in-out",
      }}
    >
      <Modal
        show={show}
        onHide={handleClose}
        centered
        className="custom_modal"
        size="lg"
        style={{
          backgroundColor: mood
            ? `${mood.color}40`
            : "rgba(0, 0, 0, 0.5)",
          transition: "all 0.3s ease-in-out",
          border: "2px solid #00000033",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: mood?.color || "#fcb1b1",
            transition: "all 0.3s ease-in-out",
            position: "relative",
            justifyContent: "center",
          }}
        >
          <Modal.Title
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontWeight: 600,
              color: "black",
              textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              pointerEvents: "none", // so close button is still clickable
            }}
          >
            {mood?.emoji} Share Your Feeling
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: 0 }} className="emotionModal_body">
          <div className="emotionModal_container">
            <div className="emotionModal_card">
              <Form>
                {/* Feelings */}
                <Form.Group>
                  <div className="emotionModal_input_container">
                    <textarea
                      className="emotionModal_textarea"
                      placeholder="What's on your mind? Share your feelings..."
                      value={feeling}
                      onChange={(e) => setFeeling(e.target.value)}
                      maxLength={maxChars}
                    ></textarea>
                    <div className="emotionModal_char_counter">
                      <Clipboard className="emotionModal_clipboard_icon" />
                      {feeling.length}/{maxChars}
                    </div>
                  </div>
                </Form.Group>

                {/* Mood */}
                <Form.Group>
                  <div className="emoji-section">
                    <h5
                      className="section-title"
                      style={{ color: mood?.color || "black" }}
                    >
                      How are you feeling?
                      <hr style={{margin:"2% 30%"}}/>
                    </h5>
                    <div className="mood-selector" ref={emojiContainerRef}>
                      {moods.map((item) => (
                        <button
                          type="button"
                          key={item.label}
                          title={item.label}
                          className={`mood_btn ${
                            mood?.label === item.label ? "selected" : ""
                          }`}
                          style={{
                            backgroundColor:
                              mood?.label === item.label
                                ? item.color
                                : "#f8f9fa",
                            transform:
                              mood?.label === item.label
                                ? "scale(1.1)"
                                : "scale(1)",
                          }}
                          onClick={() => setMood(item)}
                        >
                          {item.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </Form.Group>

                {/* Intensity */}
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <FloatingLabel label="Intensity">
                        <Form.Select
                          value={intensity}
                          onChange={(e) => setIntensity(e.target.value)}
                        >
                          <option value="">Select Intensity</option>
                          <option value="Very Low">Very Low</option>
                          <option value="Low">Low</option>
                          <option value="Moderate">Moderate</option>
                          <option value="High">High</option>
                          <option value="Very High">Very High</option>
                        </Form.Select>
                      </FloatingLabel>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="position-relative">
                      <FloatingLabel label="Trigger Reason">
                        {selectedOption === "Custom" ? (
                          <Form.Control
                            type="text"
                            placeholder="Enter custom reason..."
                            value={customTrigger}
                            onChange={(e) => {
                              setCustomTrigger(e.target.value);
                              setTrigger(e.target.value);
                            }}
                            autoFocus
                          />
                        ) : (
                          <Form.Select
                            value={selectedOption}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "Custom") {
                                setSelectedOption("Custom");
                                setCustomTrigger("");
                                setTrigger("");
                              } else {
                                setSelectedOption(val);
                                setTrigger(val);
                              }
                            }}
                          >
                            <option value="">Select Trigger</option>
                            {triggerOptions.map((group) => (
                              <optgroup
                                key={group.category}
                                label={group.category}
                              >
                                {group.triggers.map((trigger) => (
                                  <option key={trigger} value={trigger}>
                                    {trigger}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                            <option value="Custom">Custom</option>
                          </Form.Select>
                        )}
                      </FloatingLabel>

                      {/* Back Arrow Button */}
                      {selectedOption === "Custom" && (
                        <span
                          className="position-absolute top-50 translate-middle-y"
                          style={{
                            right: "10px",
                            cursor: "pointer",
                            fontSize: "1.1rem",
                            color: "#6c757d",
                          }}
                          onClick={() => {
                            setSelectedOption("");
                            setTrigger("");
                            setCustomTrigger("");
                          }}
                          title="Back to dropdown"
                        >
                          <i className="fas fa-arrow-left" />
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                {/* Activity & Reaction */}
                <Row className="mt-3">
                  <Col md={6}>
                    <FloatingLabel label="Preferred Activity">
                      <Form.Control
                        type="text"
                        placeholder="What helps you feel better?"
                        value={preferredActivity}
                        onChange={(e) => setPreferredActivity(e.target.value)}
                      />
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel label="Any Reaction">
                      <Form.Control
                        type="text"
                        placeholder="How did you react?"
                        value={partnerReaction}
                        onChange={(e) => setPartnerReaction(e.target.value)}
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer
          style={{
            backgroundColor: "#f8f9fa",
            borderTop: "1px solid #e9ecef",
            padding: "15px 25px 20px",
          }}
        >
          <Button
            variant="outline-secondary"
            onClick={handleClose}
            style={{
              border: "1.5px solid #6c757d",
              color: "#000000ff",
              fontWeight: "600",
            }}
          >
            Close
          </Button>
          <Button
            className="mood-button"
            // variant="primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: mood?.color || "#100f0eff",
              border: "1.5px solid black",
              fontWeight: "600",
            }}
          >
            {loading ? "Saving..." : "Save Feeling"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmotionModal;
