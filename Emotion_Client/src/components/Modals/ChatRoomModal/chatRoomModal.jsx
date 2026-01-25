import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { 
  FiHeart, 
  FiMessageCircle, 
  FiShield, 
  FiLock,
  FiUsers,
  FiChevronRight
} from "react-icons/fi";
import defaultAvatar from "../../../assets/default_avatar.jpeg";
import "./chatRoomModal.css";

function EmotionSupportModal({
  show,
  onClose,
  onStartChat,
  chatWithUser,
  currentUser,
  moodColor,
}) {
  const [isConnecting, setIsConnecting] = useState(false);

  if (!show || !chatWithUser) return null;

  const handleStartChat = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      onStartChat(chatWithUser);
    }, 600);
  };

  const modalStyle = {
    '--mood-color-chat-modal': moodColor || '#6f3cff',
  };

  return (
    <Modal 
      show={show} 
      onHide={onClose} 
      centered 
      className="chat-modal"
      style={modalStyle}
    >
      <Modal.Header closeButton className="chat-modal-header">
        <Modal.Title className="chat-modal-title">
          <FiHeart className="chat-modal-icon" />
          Emotional Support
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="chat-modal-body">
        <div className="chat-modal-message">
          <p className="chat-modal-main">
            You're entering a safe space 🤍
          </p>
          <p className="chat-modal-sub">
            Take a deep breath. Share only what feels comfortable.
          </p>
        </div>

        {/* Profiles */}
        <div className="chat-modal-profiles">
          <div className="chat-modal-profile">
            <img
              src={currentUser?.profileImage || defaultAvatar}
              alt="You"
              className="chat-modal-avatar"
            />
            <span className="chat-modal-name">{currentUser?.name || "You"}</span>
          </div>

          <div className="chat-modal-connector">
            <FiUsers className="chat-modal-connector-icon" />
          </div>

          <div className="chat-modal-profile">
            <img
              src={chatWithUser?.profileImage || defaultAvatar}
              alt={chatWithUser?.name}
              className="chat-modal-avatar"
            />
            <span className="chat-modal-name">{chatWithUser?.name}</span>
          </div>
        </div>

        {/* Features */}
        <div className="chat-modal-features">
          <div className="chat-modal-feature">
            <FiShield />
            <span>Safe Space</span>
          </div>
          <div className="chat-modal-feature">
            <FiLock />
            <span>Private</span>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="chat-modal-footer">
        <Button 
          variant="outline-secondary" 
          onClick={onClose}
          className="chat-modal-btn chat-modal-btn-secondary"
        >
          Not now
        </Button>
        
        <Button
          className={`chat-modal-btn chat-modal-btn-primary ${isConnecting ? 'chat-modal-connecting' : ''}`}
          onClick={handleStartChat}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <div className="chat-modal-spinner"></div>
              Connecting...
            </>
          ) : (
            <>
              <FiMessageCircle />
              Start Chat
              <FiChevronRight />
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EmotionSupportModal;