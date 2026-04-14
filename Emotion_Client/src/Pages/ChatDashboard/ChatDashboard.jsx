import React, { useEffect, useState, useRef, useCallback } from "react";
import { FiMessageSquare, FiSearch, FiUsers } from "react-icons/fi";
import { toast } from "react-toastify";

import apiClient from "../../components/utils/apiClient";
import ChatRoomModal from "../../components/Modals/ChatRoomModal/chatRoomModal";
import UserHeader from "../../components/UserHeader/UserHeader";
import UserCardsForChat from "../../components/UserCardsForChat/UserCardsForChat";
import LiveChatWindow from "../../components/LiveChatWindow/LiveChatWindow";
import { useUserContext } from "../../context/UserContextApi";
import useDebounce from "../../hooks/useDebounce";

import "./ChatDashboard.css";
import { useNavigate } from "react-router-dom";

function ChatDashboard() {
  const { isOnline: currentUserOnline } = useUserContext();

  const [currentUser, setCurrentUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [filter, setFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState(null); // State for the actual active chat window
  const navigate = useNavigate();

  /* ---------------- INFINITE SCROLL OBSERVER ---------------- */
  const observer = useRef();
  const lastUserElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchUsers(nextPage, debouncedSearchQuery, filter);
            return nextPage;
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, debouncedSearchQuery, filter],
  );

  /* ---------------- FETCH USERS ---------------- */
  const fetchUsers = useCallback(
    async (pageNum = 1, query = "", fType = "all") => {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        toast.error("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        if (pageNum === 1) setLoading(true);
        const response = await apiClient.get(
          `/chatFeature/registerUserChats/${userId}?page=${pageNum}&limit=20&search=${encodeURIComponent(query)}&filter=${encodeURIComponent(fType)}`,
        );
        let users = response?.data?.users || [];

        if (users.length === 0 && pageNum === 1) {
          users = [
            {
              _id: "fake-1",
              name: "Alice Smith",
              isOnline: true,
              mood: "Happy",
              moodColor: "#4CAF50",
              moodEmoji: "😊",
              latestMood: "Feeling great today!",
            },
            {
              _id: "fake-2",
              name: "Bob Jones",
              isOnline: false,
              mood: "Anxious",
              moodColor: "#F44336",
              moodEmoji: "😰",
              latestMood: "Just trying to get through the day.",
            },
          ];
          // Fake mock fallback
          if (!query) {
            setUsersList(users);
          } else {
            setUsersList([]); // If user searched for something, don't show mock data randomly
          }
          setHasMore(false);
        } else {
          setUsersList((prev) => (pageNum === 1 ? users : [...prev, ...users]));
          setHasMore(response?.data?.hasMore || false);
        }
      } catch (error) {
        toast.error("Failed to load users");
      } finally {
        if (pageNum === 1) setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userDetails"));
    setCurrentUser(storedUser);
  }, []);

  // Fetch users when component mounts, OR when search/filter changed
  useEffect(() => {
    setPage(1);
    fetchUsers(1, debouncedSearchQuery, filter);
  }, [debouncedSearchQuery, filter, fetchUsers]);

  /* ---------------- CHAT HANDLERS ---------------- */
  const openChatModal = useCallback((chatUser) => {
    setSelectedUser(chatUser);
    setIsChatModalOpen(true);
  }, []);

  const closeChatModal = useCallback(() => {
    setIsChatModalOpen(false);
    setSelectedUser(null);
  }, []);

  const startActualChat = useCallback((user) => {
    setIsChatModalOpen(false);
    setActiveChatUser(user);
  }, []);

  const closeActiveChat = useCallback(() => {
    setActiveChatUser(null);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    navigate("/");
  }, [navigate]);

  /* ---------------- RENDER ---------------- */
  return (
    <div className="chat-page-container">
      <div className="chat-content-wrapper">
        {activeChatUser ? (
          <LiveChatWindow
            chatWithUser={activeChatUser}
            currentUser={currentUser}
            onClose={closeActiveChat}
          />
        ) : (
          <>
            {/* HEADER */}
            <header className="chat-header">
              <div className="chat-header-main">
                <UserHeader
                  isOnline={currentUserOnline}
                  user={currentUser}
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
                  <button
                    className="filter-btn"
                    onClick={() => navigate("/emotion")}
                  >
                    Back
                  </button>
                </div>

                <div className="results-count">
                  {usersList.length}{" "}
                  {usersList.length === 1 ? "person" : "people"} found
                </div>
              </div>
            </header>

            {/* USER GRID */}
            {loading ? (
              <div className="chat-loading-container">
                <p className="chat-loading-text">Loading users...</p>
              </div>
            ) : usersList.length === 0 ? (
              <div className="empty-state">
                <h3>No users found</h3>
                <p>Try changing your search or filter.</p>
              </div>
            ) : (
              <>
                <div className="user-grid">
                  {usersList.map((chatUser, index) => {
                    const isLastElement = usersList.length === index + 1;
                    return (
                      <UserCardsForChat
                        key={`user-${chatUser._id}-${index}`}
                        ref={isLastElement ? lastUserElementRef : null}
                        chatUser={chatUser}
                        openChatModal={openChatModal}
                        index={index}
                      />
                    );
                  })}
                </div>

                {hasMore && (
                  <div className="chat-pagination-loading">
                    <p className="chat-loading-text">Loading more users...</p>
                  </div>
                )}
              </>
            )}

            {/* CHAT MODAL */}
            <ChatRoomModal
              show={isChatModalOpen}
              onClose={closeChatModal}
              onStartChat={startActualChat}
              chatWithUser={selectedUser}
              currentUser={currentUser}
              moodColor={currentUser?.moodColor}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default ChatDashboard;
