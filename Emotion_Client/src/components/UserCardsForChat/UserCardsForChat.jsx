import React from "react";
import { FiMessageSquare } from "react-icons/fi";
import defaultAvatar from "../../assets/default_avatar.jpeg";
import "./UserCardsForChat.css";

const UserCardsForChat = React.memo(
  React.forwardRef(({ chatUser, openChatModal, index = 0 }, ref) => {
    // Stagger the animation delay based on index (cap at 15 so it doesn't take forever to load late items)
    const delay = Math.min(index, 15) * 0.05;

    return (
      <div ref={ref} className="user-card" style={{ animationDelay: `${delay}s` }}>
        <div className="avatar-wrapper">
          <img
            src={chatUser.profileImage || defaultAvatar}
            alt={chatUser.name}
            loading="lazy"
            className="user-avatar"
            style={{ border: `3px solid ${chatUser.moodColor || "#ccc"}` }}
          />
          <span
            className={`status-dot ${chatUser.isOnline ? "online" : "offline"}`}
          />
        </div>

        <h3 className="user-name-chat">{chatUser.name}</h3>

        <span
          className="mood-pill"
          style={{ backgroundColor: chatUser.moodColor || "#ccc" }}
        >
          {chatUser.moodEmoji || "💬"} {chatUser.latestMood || "No status"}
        </span>

        <div className="user-footer">
          <span
            className={`status-text ${chatUser.isOnline ? "online" : "offline"}`}
          >
            {chatUser.isOnline ? "Online" : "Offline"}
          </span>

          <button
            className="chat-btn-modal"
            onClick={() => openChatModal(chatUser)}
          >
            <FiMessageSquare size={16} /> Chat
          </button>
        </div>
      </div>
    );
  })
);

export default UserCardsForChat;
