import React, { useState, useEffect } from "react";
import { FiPlus, FiBarChart2, FiGrid, FiFilter, FiUser, FiMail, FiLogOut, FiHeart, FiMapPin, FiSun, FiMoon } from "react-icons/fi";
import EmotionTable from "./EmotionTable/EmotionTable";
import EmotionModal from "../Modals/EmotionModal/emotionModal";
import EmotionCreatedCard from "./EmotionCard/EmotionCard";
import apiClient from "../utils/apiClient";
import "./EmotionTracker.css";

const EmotionTracker = () => {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState("cards");
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("");

  // Get user data from localStorage and set greeting
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userDetails"));
    setUser(userData);
    setGreeting(getGreeting());
  }, []);

  // Function to get appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Fetch all emotion data for the user
  const fetchEmotionData = async () => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      try {
        const res = await apiClient.get(`/userEmotion/getUserEmotion/${userId}`);
        setData(res.data.emotionData || []);
      } catch (error) {
        console.error("Failed to fetch emotion data:", error);
      }
    }
  };

  useEffect(() => {
    fetchEmotionData();
  }, []);

  // Filter data based on time selection
  const filteredData = () => {
    const now = new Date();
    if (filter === "week") {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return data.filter(item => new Date(item.createdAt) >= oneWeekAgo);
    } else if (filter === "month") {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return data.filter(item => new Date(item.createdAt) >= oneMonthAgo);
    }
    return data;
  };

  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("user_id");
    window.location.href = "/";
  };

  return (
    <div className="emotion-tracker-container">
      {/* Combined Header */}
      <div className="combined-header">
        <div className="header-left">
          <div className="app-title">
            <FiHeart className="title-icon" />
            <h1>Emotion Tracker</h1>
          </div>
          <p className="app-subtitle">Understand and reflect on your emotional journey</p>
          
          {/* Personalized Greeting */}
        </div>
          <div className="user-greeting">
            <span className="greeting-text">{greeting}</span>
            <span className="user-name">{user?.Name || "User"}</span>
            <span className="greeting-emoji">
              {greeting === "Good Morning" ? "☀️" : greeting === "Good Afternoon" ? "🌞" : "🌙"}
            </span>
          </div>
        
        <div className="header-right">
          <div className="user-profile">
            <div className="user-info">
              <div className="user-avatar">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.Name} className="profile-image" />
                ) : (
                  <div className="avatar-placeholder">
                    <FiUser size={24} />
                  </div>
                )}
                {/* <div className="online-indicator"></div> */}
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
                <span className="status-dot"></span>
                Online
              </div>
              <button className="logout-btn" onClick={handleLogout} title="Logout">
                <FiLogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-card">
          <span className="stat-number">{data.length}</span>
          <span className="stat-label">Total Entries</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {new Set(data.map(item => item.mood)).size}
          </span>
          <span className="stat-label">Different Moods</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {Math.round(data.filter(item => item.intensity === "High" || item.intensity === "Very High").length / data.length * 100) || 0}%
          </span>
          <span className="stat-label">High Intensity</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {data.filter(item => item.intensity === "Low" || item.intensity === "Very Low").length}
          </span>
          <span className="stat-label">Calm Moments</span>
        </div>
      </div>

      <div className="emotion-content">
        <div className="controls-panel">
          <button
            className="primary-button add-entry-btn"
            onClick={() => setShowModal(true)}
          >
            <FiPlus /> New Entry
          </button>

          <div className="view-controls">
            <button 
              className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              <FiGrid /> Cards
            </button>
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <FiBarChart2 /> Table
            </button>
          </div>

          <div className="filter-controls">
            <FiFilter />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Time</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <div className="emoji-placeholder">😊</div>
            </div>
            <h3>No emotions recorded yet</h3>
            <p>Start tracking your emotions to understand patterns and improve wellbeing</p>
            <button
              className="primary-button"
              onClick={() => setShowModal(true)}
            >
              <FiPlus /> Add Your First Entry
            </button>
          </div>
        ) : (
          <>
            {viewMode === "cards" ? (
              <EmotionCreatedCard data={filteredData()} />
            ) : (
              <EmotionTable
                data={filteredData()}
                setData={setData}
                setShowModal={() => setShowModal(true)}
                setEditItem={setEditItem}
              />
            )}
          </>
        )}

        <EmotionModal
          show={showModal}
          handleClose={() => {
            setShowModal(false);
            setEditItem(null);
          }}
          fetchEmotionData={fetchEmotionData}
          editItem={editItem}
        />
      </div>
    </div>
  );
};

export default EmotionTracker;