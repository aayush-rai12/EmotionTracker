import React from 'react';
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { 
  FiMail, FiLock, FiArrowRight, 
  FiUser, FiCheck, FiHeart
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import './LoginModal.css';

const moods = [
  { label: "Happy", emoji: "😊", color: "#fde2e2" },
  { label: "Sad", emoji: "😢", color: "#fff3cd" },
  { label: "Angry", emoji: "😡", color: "#f8d7da" },
  { label: "Calm", emoji: "😌", color: "#d4edda" },
  { label: "Excited", emoji: "🤩", color: "#e0c3fc" },
  { label: "Loved", emoji: "❤️", color: "#c9184a" },//fcd5ce
  { label: "Celebrating", emoji: "🥳", color: "#d1f7ff" },
];

const LoginModal = ({ show, handleClose }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose} centered className="emotion-auth-modal">
      <Modal.Header closeButton className="modal-header">
        <div className="header-content">
          <div className="emotion-illustration">
            {moods.map((moods, index) => (
              <div 
                key={index} 
                className="emoji-bubble" 
                // style={{ backgroundColor: moods.color }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <span className="emoji">{moods.emoji}</span>
              </div>
            ))}
          </div>
          <Modal.Title className="modal-title">Welcome to HeartSpace</Modal.Title>
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
              required 
            />
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" className="checkbox-input" />
              <label htmlFor="remember" className="checkbox-label">
                <FiCheck className="check-icon" />
                Keep me logged in
              </label>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>
          
          <button type="submit" className="auth-button primary">
            Continue Your Journey
            <FiArrowRight className="arrow-icon" />
          </button>
        </form>
        
        <div className="social-auth">
          <div className="divider">
            <span>or connect with</span>
          </div>
          
          <div className="social-buttons">
            <button className="auth-button google">
              <FcGoogle className="social-icon" />
              Google
            </button>
            <button className="auth-button facebook">
              <FaFacebook className="social-icon" />
              Facebook
            </button>
          </div>
        </div>
        
        <p className="auth-footer">
          New to emotional wellness? <Link to="/register" className="auth-link">Begin your journey</Link>
        </p>
      </Modal.Body>
    </Modal>
  )
}

export default LoginModal;