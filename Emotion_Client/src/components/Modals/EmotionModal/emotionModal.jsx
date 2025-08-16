import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Form, Row, Col, FloatingLabel } from "react-bootstrap";
import { Clipboard } from "lucide-react";
import "./emotionModal.css";
import apiClient from "../../utils/apiClient";

const moods = [
  { label: "Happy", emoji: "😊", color: "#fde2e2" },
  { label: "Sad", emoji: "😢", color: "#fff3cd" },
  { label: "Angry", emoji: "😡", color: "#f8d7da" },
  { label: "Calm", emoji: "😌", color: "#d4edda" },
  { label: "Excited", emoji: "🤩", color: "#e0c3fc" },
  { label: "Loved", emoji: "❤️", color: "#c9184a" },//fcd5ce
  { label: "Celebrating", emoji: "🥳", color: "#d1f7ff" },
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
      "Friend’s unexpected support",
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
    const userId = JSON.parse(localStorage.getItem("user"))?.user_Id;
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
      moodColor: mood?.color || "#fcb1b1",
      intensity,
      triggerReason,
      preferredActivity: preferredActivity.trim(),
      partnerImpact: partnerReaction.trim(),
    };

    try {
      setLoading(true);
      let response;
      if (editItem?._id) {
        response = await apiClient.patch(
          `/user/updateEmotionCard/${editItem._id}`,
          { ...emotionData, _id: editItem._id }
        );
      } else {
        response = await apiClient.post("/user/saveEmotionData", emotionData);
      }

      if (response.status === 200) {
        await fetchEmotionData();
        handleClose();
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
        background: mood?.color || "#fcb1b1",
        transition: "background 0.5s ease-in-out",
      }}
    >
      <Modal
        show={show}
        onHide={handleClose}
        centered
        className="custom_modal"
        size="lg"
        style={{
          backgroundColor: `${mood?.color}20`,
          boxShadow: mood
            ? `0px 4px 20px ${mood.color}80`
            : "0px 4px 10px rgba(0, 0, 0, 0.1)",
          transition: "all 0.5s ease-in-out",
        }}
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: `${mood?.color}20` }}
        >
          <Modal.Title>Share Your Feeling</Modal.Title>
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
                      placeholder="Share your feeling..."
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
                                : "#f0f0f0",
                          }}
                          onClick={() => setMood(item)}
                        >
                          {item.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </Form.Group>

                {/* Intensity + Trigger */}
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

                      {/* 🔙 Back Arrow Button */}
                      {selectedOption === "Custom" && (
                        <span
                          className="position-absolute top-50 translate-middle-y"
                          style={{
                            right: "10px",
                            cursor: "pointer",
                            fontSize: "1.1rem",
                            color: "#555",
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

                    {selectedOption === "Custom" && (
                      <Form.Group className="position-relative mt-2">
                       
                        <span
                          className="position-absolute top-50 translate-middle-y"
                          style={{ right: "10px", cursor: "pointer" }}
                          onClick={() => {
                            setSelectedOption("");
                            setCustomTrigger("");
                          }}
                          title="Back to list"
                        >
                      
                        </span>
                      </Form.Group>
                    )}
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
                    <FloatingLabel label="Partner Reaction">
                      <Form.Control
                        type="text"
                        placeholder="How did your partner react?"
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

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmotionModal;
