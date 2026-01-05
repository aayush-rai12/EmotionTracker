import React, { useEffect, useState, useMemo } from "react";
import apiClient from "../../components/utils/apiClient";
import {FiMessageSquare, FiSearch, FiUsers} from "react-icons/fi";
import defaultAvatar from "../../assets/default_avatar.jpeg";
import "./ChatDashboard.css";
import ChatRoomModal from "../../components/Modals/ChatRoomModal/chatRoomModal";
import UserHeader from "../../components/UserHeader/UserHeader";
import { useUserContext } from "../../context/UserContextApi";

function ChatDashboard() {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [ischatModalOpen, setIsChatModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const { isOnline } = useUserContext();
  const [user, setUser] = useState(null);
  //  Fetch Users
  const fetchData = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      console.error("User ID not found");
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.get(
        `/chatFeature/registerUserChats/${userId}`
      );
      setUsersList(response?.data?.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userDetails"));
    setUser(userData);
    fetchData();
  }, []);



  //  Open Chat Modal
  const openChatModal = (userId) => {
    //  for opening the chat modal
    setIsChatModalOpen(true);
  };

  //  Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList
      .filter((user) => {
        if (filter === "online") return user.isOnline;
        if (filter === "offline") return !user.isOnline;
        return true;
      })
      .filter(
        (user) =>
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.mood?.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [usersList, filter, searchQuery]);

  return (
    <div className="chat-page-container">
      <div className="chat-content-wrapper">
        {/*  HEADER  */}
        <header className="chat-header">
          <div className="chat-header-main">
            <UserHeader 
            isOnline={isOnline}
            user={user}/>
            <div className="chat-header-left">
              <FiMessageSquare className="chat-message-icon" />
              <div className="chat-header-text">
                <h1 className="chat-page-title">Chat Dashboard</h1>
                <p className="chat-subtitle">
                  Connect with your emotional support members
                </p>
              </div>
            </div>

          </div>

          {/*  SEARCH + FILTER  */}
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
              <button
                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                <FiUsers /> All
              </button>
              <button
                className={`filter-btn ${filter === "online" ? "active" : ""}`}
                onClick={() => setFilter("online")}
              >
                Online
              </button>
              <button
                className={`filter-btn ${filter === "offline" ? "active" : ""}`}
                onClick={() => setFilter("offline")}
              >
                Offline
              </button>
            </div>

            <div className="results-count">
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1 ? "person" : "people"} found
            </div>
          </div>
        </header>

        {/*  USER GRID  */}
        {loading ? (
          <p className="chat-loading-text">Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <h3>No users found</h3>
            <p>Try changing your search or filter settings.</p>
          </div>
        ) : (
          <div className="user-grid">
            {filteredUsers.map((user) => (
              <div key={user._id} className="user-card">
                <div className="user-info">
                  <div className="avatar-wrapper">
                    <img
                      src={user.profileImage || defaultAvatar}
                      alt={user.name}
                      className="user-avatar"
                    />
                    <span
                      className={`status-dot ${
                        user.isOnline ? "online" : "offline"
                      }`}
                    ></span>
                  </div>
                  <div className="user-details">
                    <h3>{user.name}</h3>
                    <p>
                      {user.mood || "No status"} {user.moodEmoji || ""}
                    </p>
                  </div>
                </div>
                <div className="user-footer">
                  <span
                    className={`status-text ${
                      user.isOnline ? "online" : "offline"
                    }`}
                  >
                    {user.isOnline ? "Online" : "Offline"}
                  </span>
                  <button
                    className="chat-btn-modal"
                    onClick={() => openChatModal(user._id)}
                  >
                    <FiMessageSquare /> Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <ChatRoomModal
          show={ischatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
          }}
          chatWithUserId={null}
        />
      </div>
    </div>
  );
}

export default ChatDashboard;
