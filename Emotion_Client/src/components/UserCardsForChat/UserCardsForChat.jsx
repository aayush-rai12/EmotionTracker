import React from "react";
import { FiMessageSquare, FiMessageCircle } from "react-icons/fi";
import defaultAvatar from "../../assets/default_avatar.jpeg";
import "./UserCardsForChat.css";

const UserCardsForChat = React.memo(
  React.forwardRef(({ chatUser, openChatModal, index = 0 }, ref) => {
    // Stagger the animation delay based on index
    const delay = Math.min(index, 15) * 0.05;

    return (
      <div ref={ref} className="user-card" style={{ animationDelay: `${delay}s` }}>
        {chatUser?.unreadMessageCount > 0 && (
          <span className="unread-pill">
            <FiMessageCircle /> Unread: {chatUser.unreadMessageCount}
          </span>
        )}
        <div className="avatar-wrapper">
          <img
            src={chatUser.profileImage || defaultAvatar}
            alt={chatUser.name}
            loading="lazy"
            className="user-avatar"
            style={{ border: `2px solid ${chatUser.moodColor || "#4131b5ff"}` }}
          />
          <span
            className={`status-dot ${chatUser.isOnline ? "online" : "offline"}`}
          />
        </div>

        <h3 className="user-name-chat">{chatUser.name}</h3>
        
        <div className={`status-subtitle ${chatUser.isOnline ? "online" : "offline"}`}>
          {chatUser.isOnline ? "Active Now" : "Currently Offline"}
        </div>

        <span
          className="mood-pill"
          style={{ backgroundColor: chatUser.moodColor || "#ccc" }}
        >
          {chatUser.moodEmoji || "💬"} {chatUser.latestMood || "No status"}
        </span>

        <div className="card-spacer"></div>

        <div className="user-footer">
          <button
            className="chat-btn-modal"
            onClick={() => openChatModal(chatUser)}
          >
            <FiMessageSquare size={16} /> Chat Now
          </button>
        </div>
      </div>
    );
  })
);

export default UserCardsForChat;
