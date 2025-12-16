import React from "react";
import {FiLogOut, FiHeart, FiUser, FiMail, FiMapPin } from "react-icons/fi";
import "./UserHeader.css";

function UserHeader({greeting, user, isOnline, handleLogout}) {
  return (
    <div className="combined-header">
      <div className="header-left">
        <div className="app-title">
          <FiHeart className="title-icon" />
          <h1>Your Emotion Diary</h1>
        </div>
        <p className="app-subtitle">
          Understand and reflect on your emotional journey
        </p>

        {/* Personalized Greeting */}
      </div>
      <div className="user-greeting">
        <span className="greeting-text">Hi {greeting}</span>
        <span className="user-name">{user?.Name || "User"}!</span>
        <span className="greeting-emoji">
          {greeting === "Good Morning"
            ? "☀️"
            : greeting === "Good Afternoon"
            ? "🌞"
            : "🌙"}
        </span>
      </div>

      <div className="header-right">
        <div className="user-profile">
          <div className="user-info">
            <div className="user-avatar">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.Name}
                  className="profile-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  <FiUser size={24} />
                </div>
              )}
            </div>
            <div className="user-details">
              <h3>{user?.Name || "User"}</h3>
              <p>
                <FiMail size={12} />
                {user?.email || "user@example.com"}
              </p>
              <p className="user-location">
                <FiMapPin size={12} />
                {user?.location || "Unknown Location"}
              </p>
            </div>
          </div>
          <div className="header-actions">
            <div className="login-status">
              <span
                className={`status-dot-header ${isOnline ? "online" : "offline"}`}
              ></span>
              <span
                className={`login-status-${isOnline ? "online" : "offline"}`}
              >
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
            <button
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHeader;
