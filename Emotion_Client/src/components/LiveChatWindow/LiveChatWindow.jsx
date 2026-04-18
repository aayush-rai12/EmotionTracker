import React, { useState, useEffect, useRef } from "react";
import { FiArrowLeft, FiSend, FiMoreVertical, FiHeart } from "react-icons/fi";
import { toast } from "react-toastify";
import apiClient from "../utils/apiClient";
import defaultAvatar from "../../assets/default_avatar.jpeg";
import "./LiveChatWindow.css";
import { socket } from "../utils/socket";

function LiveChatWindow({ chatWithUser, currentUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const isMountedRef = useRef(true);
  const senderId = currentUser?.user_Id || localStorage.getItem("user_id");
  const receiverId = chatWithUser?._id;

  // Socket handlers (Join and Re-join)
  useEffect(() => {
    if (!senderId) return;

    const handleJoin = () => {
      socket.emit("join", senderId);
    };

    // Join immediately
    handleJoin();

    // Re-join on reconnection
    socket.on("connect", handleJoin);

    return () => {
      socket.off("connect", handleJoin);
    };
  }, [senderId]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Scroll to bottom whenever messages array changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chat history
  const fetchMessages = async () => {
    if (!senderId || !receiverId) return;
    try {
      const response = await apiClient.get(
        `/chatFeature/getChatHistory/${receiverId}`,
      );
      if (isMountedRef.current && response.data?.status) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  // Socket listener for real-time messages
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      // Only add message if it's from the person we are chatting with
      if (data.senderId === receiverId) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [receiverId]);

  // Fetch initial history
  useEffect(() => {
    fetchMessages();

    // Re-fetch if they switch back to this tab (optional safety)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchMessages();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [senderId, receiverId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messagePayload = {
      senderId,
      receiverId,
      text: inputText,
    };

    // Optimistic UI update
    const optimisticMessage = {
      _id: `temp-${Date.now()}`,
      senderId,
      receiverId,
      text: inputText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    setInputText("");
    setIsSending(true);

    try {
      socket.emit("send_message", {
        senderId,
        receiverId,
        text: inputText,
      });

      if (isMountedRef.current) {
        toast.success("Message sent");
      }
    } catch (error) {
      if (isMountedRef.current) toast.error("Error sending message");
      console.error("Send error:", error.message);
    } finally {
      if (isMountedRef.current) setIsSending(false);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="live-chat-window animate-fade-in">
      {/* Header */}
      <div className="chat-window-header">
        <button className="back-btn" onClick={onClose}>
          <FiArrowLeft size={20} />
        </button>

        <div className="header-user-info">
          <div className="avatar-wrapper-chat">
            <img
              src={chatWithUser?.profileImage || defaultAvatar}
              alt={chatWithUser?.Name || chatWithUser?.name}
              style={{
                border: `2px solid ${chatWithUser?.moodColor || "#ccc"}`,
              }}
            />
            <span
              className={`status-dot ${chatWithUser?.isOnline ? "online" : "offline"}`}
            />
          </div>
          <div className="user-details-header">
            <h3>{chatWithUser?.Name || chatWithUser?.name || "User"}</h3>
            <span
              className="mood-pill-small"
              style={{ backgroundColor: chatWithUser?.moodColor || "#ccc" }}
            >
              {chatWithUser?.moodEmoji || "💬"}{" "}
              {chatWithUser?.latestMood || "No status"}
            </span>
          </div>
        </div>

        <button className="more-btn">
          <FiMoreVertical size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="chat-messages-container">
        {loading && messages.length === 0 ? (
          <div className="chat-loading-state">
            <div className="spinner"></div>
            <p>Loading secure space...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-empty-state">
            <FiHeart size={48} className="empty-heart-icon" />
            <h3>It's a safe space</h3>
            <p>
              Say hi to {chatWithUser?.Name || chatWithUser?.name} and share
              your thoughts.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === senderId;
            // Add a date divider if it's a new day
            let showDateDivider = false;
            if (index > 0) {
              const prevDate = new Date(
                messages[index - 1].createdAt,
              ).toDateString();
              const currDate = new Date(msg.createdAt).toDateString();
              if (prevDate !== currDate) showDateDivider = true;
            } else {
              showDateDivider = true; // Show date for first message
            }

            return (
              <React.Fragment key={msg._id || index}>
                {showDateDivider && (
                  <div className="date-divider">
                    <span>
                      {new Date(msg.createdAt).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                <div
                  className={`message-wrapper ${isMe ? "sent" : "received"}`}
                >
                  {!isMe && (
                    <img
                      src={chatWithUser?.profileImage || defaultAvatar}
                      alt="avatar"
                      className="message-avatar"
                    />
                  )}
                  <div className="message-content">
                    <p>{msg.text}</p>
                    <span className="message-time">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form className="chat-input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isSending}
        />
        <button
          type="submit"
          className="send-btn"
          disabled={!inputText.trim() || isSending}
        >
          <FiSend size={18} />
        </button>
      </form>
    </div>
  );
}

export default LiveChatWindow;
