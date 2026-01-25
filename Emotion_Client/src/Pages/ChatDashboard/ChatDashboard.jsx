import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FiMessageSquare, FiSearch, FiUsers } from "react-icons/fi";
import { toast } from "react-toastify";

import apiClient from "../../components/utils/apiClient";
import defaultAvatar from "../../assets/default_avatar.jpeg";
import ChatRoomModal from "../../components/Modals/ChatRoomModal/chatRoomModal";
import UserHeader from "../../components/UserHeader/UserHeader";
import { useUserContext } from "../../context/UserContextApi";

import "./ChatDashboard.css";
import { useNavigate } from "react-router-dom";

function ChatDashboard() {
  const { isOnline: currentUserOnline } = useUserContext();

  const [currentUser, setCurrentUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const navigate = useNavigate();
  
  /* ---------------- FETCH USERS ---------------- */
  const fetchUsers = useCallback(async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      toast.error("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.get(
        `/chatFeature/registerUserChats/${userId}`
      );
      const users = response?.data?.users || [];      
      setUsersList(users);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userDetails"));
    setCurrentUser(storedUser);
    fetchUsers();
  }, [fetchUsers]);

  /* ---------------- FILTER USERS ---------------- */
  const filteredUsers = useMemo(() => {
    const result = usersList
      .filter(u => {
        if (filter === "online") return u.isOnline;
        if (filter === "offline") return !u.isOnline;
        return true;
      })
      .filter(u => {
        const query = searchQuery.toLowerCase();
        return (
          u.name?.toLowerCase().includes(query) ||
          (u.mood || "").toLowerCase().includes(query)
        );
      });

    return result;
  }, [usersList, filter, searchQuery]);

  /* ---------------- CHAT HANDLERS ---------------- */
  const openChatModal = (chatUser) => {
    setSelectedUser(chatUser);
    setIsChatModalOpen(true);
  };

  const closeChatModal = () => {
    setIsChatModalOpen(false);
    setSelectedUser(null);
  };
   const handleLogout = () => {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    navigate("/");
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="chat-page-container">
      <div className="chat-content-wrapper">
        {/* HEADER */}
        <header className="chat-header">
          <div className="chat-header-main">
            <UserHeader isOnline={currentUserOnline} user={currentUser} 
            handleLogout={handleLogout}
            />

            <div className="chat-header-left">
              <FiMessageSquare className="chat-message-icon" />
              <div>
                <h1 className="chat-page-title">Chat Dashboard</h1>
                <p className="chat-subtitle">
                  Connect with your emotional support members
                </p>
              </div>
            </div>
          </div>

          {/* SEARCH + FILTER */}
          <div className="chat-controls-row">
            <div className="search-input-wrapper">
              <FiSearch className="chat-search-icon" />
              <input
                type="text"
                placeholder="Search by name or mood..."
                className="chat-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="chat-filter-buttons">
              {["all", "online", "offline"].map((type) => (
                <button
                  key={type}
                  className={`filter-btn ${filter === type ? "active" : ""}`}
                  onClick={() => setFilter(type)}
                >
                  {type === "all" && <FiUsers />}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
                
              ))}
              <button className="filter-btn" onClick={() => navigate('/emotion')}>Back</button>
            </div>

            <div className="results-count">
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1 ? "person" : "people"} found
            </div>
          </div>
        </header>

        {/* USER GRID */}
        {loading ? (
          <div className="chat-loading-container"><p className="chat-loading-text">Loading users...</p></div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <h3>No users found</h3>
            <p>Try changing your search or filter.</p>
          </div>
        ) : (
          <div className="user-grid">
            {filteredUsers.map((chatUser) => (
              <div key={chatUser._id} className="user-card">
                <div className="avatar-wrapper">
                  <img
                    src={chatUser.profileImage || defaultAvatar}
                    alt={chatUser.name}
                    className="user-avatar"
                    style={{ border: `3px solid ${chatUser.moodColor || '#ccc'}` }}
                  />
                  <span
                    className={`status-dot ${
                      chatUser.isOnline ? "online" : "offline"
                    }`}
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
                    className={`status-text ${
                      chatUser.isOnline ? "online" : "offline"
                    }`}
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
            ))}
          </div>
        )}

        {/* CHAT MODAL */}
        <ChatRoomModal
          show={isChatModalOpen}
          onClose={closeChatModal}
          onStartChat={() => toast.info("Chat feature coming soon!")}
          chatWithUser={selectedUser}
          currentUser={currentUser}
          moodColor={currentUser?.moodColor}
        />
      </div>
    </div>
  );
}

export default ChatDashboard;
