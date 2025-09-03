import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight, FiCheck } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import "./LoginModal.css";
import apiClient from "../../utils/apiClient";

const moods = [
  { label: "Happy", emoji: "😊", color: "#fde2e2" },
  { label: "Sad", emoji: "😢", color: "#fff3cd" },
  { label: "Angry", emoji: "😡", color: "#f8d7da" },
  { label: "Calm", emoji: "😌", color: "#d4edda" },
  { label: "Excited", emoji: "🤩", color: "#e0c3fc" },
  { label: "Loved", emoji: "❤️", color: "#c9184a" },
  { label: "Celebrating", emoji: "🥳", color: "#d1f7ff" },
];

const LoginModal = ({ show, onClose, prefilledEmail = "", message = "" }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resMessage, setResMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResMessage("");
    try {
      const response = await apiClient.post("/auth/users", {
        email,
        password,
        rememberMe,
      });
      if (response?.data.success) {
        setResMessage(response.data.message); // Show success message on button
        localStorage.setItem("user_id",response?.data?.user?.user_Id);
        localStorage.setItem("userDetails", JSON.stringify(response?.data?.user));
        localStorage.setItem("token", response?.data?.token);
        // Wait then navigate
        setTimeout(() => {
          navigate("/emotion");
        }, 1500);
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered className="emotion-auth-modal">
      <Modal.Header closeButton className="modal-header" style={{background: "linear-gradient(135deg, #8a7bc8 0%, #6a5ac4 100%)"}}>
        <div className="header-content">
          <div className="emotion-illustration">
            {moods.map((mood, index) => (
              <div
                key={index}
                className="emoji-bubble"
                style={{ backgroundColor: mood.color }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <span className="emoji">{mood.emoji}</span>
              </div>
            ))}
          </div>
          <Modal.Title className="modal-title">
            Welcome to HeartSpace
          </Modal.Title>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
        </div>
      </Modal.Header>

      <Modal.Body className="modal-body">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <FiMail className="label-icon" />
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <FiLock className="label-icon" />
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                className="checkbox-input"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember" className="checkbox-label">
                <FiCheck className="check-icon" />
                Keep me logged in
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="forgot-password"
              onClick={onClose}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className={`auth-button primary ${
              resMessage ? "success-style" : ""
            }`}
            disabled={isLoading || !!resMessage}
          >
            {resMessage
              ? resMessage
              : isLoading
              ? "Logging in..."
              : "Continue Your Journey"}
            <FiArrowRight className="arrow-icon" />
          </button>
        </form>

        <div className="social-auth">
          <div className="divider">
            <span>or connect with</span>
          </div>

          <div className="social-buttons">
            <button
              type="button"
              className="auth-button google"
              onClick={() => {
                // Add Google OAuth logic here
              }}
            >
              <FcGoogle className="social-icon" />
              Google
            </button>
            <button
              type="button"
              className="auth-button facebook"
              onClick={() => {
                // Add Facebook OAuth logic here
              }}
            >
              <FaFacebook className="social-icon" />
              Facebook
            </button>
          </div>
        </div>

        <p className="auth-footer">
          New to emotional wellness?{" "}
          <Link to="/register" className="auth-link" onClick={onClose}>
            Begin your journey
          </Link>
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
