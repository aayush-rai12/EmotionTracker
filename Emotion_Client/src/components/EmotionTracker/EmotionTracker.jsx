import React, { useState, useEffect } from "react";
import {FiPlus, FiBarChart2, FiGrid, FiFilter, FiUser, FiMail, FiLogOut, FiHeart, FiMapPin, FiSun, FiMoon, FiMessageSquare} from "react-icons/fi";
import EmotionTable from "./EmotionTable/EmotionTable";
import EmotionModal from "../Modals/EmotionModal/emotionModal";
import EmotionCreatedCard from "./EmotionCard/EmotionCard";
import apiClient from "../utils/apiClient";
import "./EmotionTracker.css";
import { useNavigate } from "react-router-dom";
import UserHeader from "../UserHeader/UserHeader";
import { useUserContext } from "../../context/UserContextApi";

const EmotionTracker = () => {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState("cards");
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState(null);
  const { isOnline } = useUserContext();
  const navigate = useNavigate();

  // Get user data from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userDetails"));
    setUser(userData);
  }, []);

  // Fetch all emotion data for the user
  const fetchEmotionData = async () => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      try {
        const res = await apiClient.get(
          `/userEmotion/getUserEmotion/${userId}`
        );
        setData(res.data.emotionData || []);
      } catch (error) {
        alert("Failed to fetch emotion data:", error.message);
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
      return data.filter((item) => new Date(item.createdAt) >= oneWeekAgo);
    } else if (filter === "month") {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return data.filter((item) => new Date(item.createdAt) >= oneMonthAgo);
    }
    return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="emotion-tracker-container">
      {/* Combined Header */}
      <UserHeader 
        user={user}
        isOnline={isOnline}
        handleLogout={handleLogout}
      />

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-card streak-card">
          <span className="streak-number">
            🔥 {user?.streak || 0} day{user?.streak === 1 ? "" : "s"}
          </span>
         <div className="user-stats">
            <span className="milestone-message">{user?.milestoneMessage}</span>
            <span className="highest-streak">
              🏆 Best: {user?.highestStreak || 0} days
            </span>
          </div> 
        </div>
        <div className="stat-card">
          <span className="stat-number">{data.length}</span>
          <span className="stat-label">Total Entries</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {new Set(data.map((item) => item.mood)).size}
          </span>
          <span className="stat-label">Different Moods</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {Math.round(
              (data.filter(
                (item) =>
                  item.intensity === "High" || item.intensity === "Very High"
              ).length /
                data.length) *
                100
            ) || 0}
            %
          </span>
          <span className="stat-label">High Intensity</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {
              data.filter(
                (item) =>
                  item.intensity === "Low" || item.intensity === "Very Low"
              ).length
            }
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
              className={`view-btn ${viewMode === "cards" ? "active" : ""}`}
              onClick={() => setViewMode("cards")}
            >
              <FiGrid /> Cards
            </button>
            <button
              className={`view-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
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
            <button className="chat-btn primary-button" onClick={()=>navigate('/chatDeshboard')}><FiMessageSquare/> Chat Dashboad</button>
        </div>

        {/* Info based on filter */}
        <div className="filter-summary">
          <p>
            Showing <strong>{filteredData().length}</strong> entries{" "}
            {filter !== "all" && `from the past ${filter}`}
          </p>
        </div>

        {data.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <div className="emoji-placeholder">😊</div>
            </div>
            <h3>No emotions recorded yet</h3>
            <p>
              Start tracking your emotions to understand patterns and improve
              wellbeing
            </p>
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
              <EmotionCreatedCard 
              data={filteredData()}
              userName={user?.Name || "User"} />
            ) : (
              <EmotionTable
                data={filteredData()}
                setData={setData}
                setShowModal={() => setShowModal(true)}
                setEditItem={setEditItem}
                userName={user?.Name || "User"}
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
