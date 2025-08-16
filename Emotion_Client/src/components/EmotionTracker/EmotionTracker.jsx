import React, { useState, useEffect } from "react";
import EmotionTable from "./EmotionTable";
import EmotionModal from "../Modals/EmotionModal/emotionModal";
import apiClient from "../utils/apiClient";
import "./EmotionTracker.css";
import EmotionCreatedCard from "./EmotionCard";

const EmotionTracker = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [bgColor, setBgColor] = useState("#fcb1b1");
  const [editItem, setEditItem] = useState(null);

  const [data, setData] = useState([]);

  // Fetch all emotion data for the user
  const fetchEmotionData = async () => {
    const userId = JSON.parse(localStorage.getItem("user"))?.user_Id;
    if (userId) {
      try {
        const res = await apiClient.get(`/user/getEmotionData/${userId}`);
        setData(res.data.emotionData || []);
      } catch (error) {
        console.error("Failed to fetch emotion data:", error);
      }
    }
  };

  useEffect(() => {
    fetchEmotionData();
  }, []);

  return (
    <div className="main_emotion_container">
      <div className="wrapper">
        <div className="sub_emotion_container">
          <div className="emotion_container_header">
            <div>
              <h2 className="emotion_title">Zozo's Emotion Tracker</h2>
              <p className="emotion_subtitle text-neutral-700">
                You can track your info about your emotions here.
              </p>
            </div>
            <button
              className="add_emotion_btn"
              onClick={() => setShowModal(true)}
            >
              Add New <i className="fas fa-plus"></i>
            </button>
          </div>

          <EmotionTable
            data={data}
            setData={setData}
            setShowModal={() => setShowModal(true)}
            setEditItem={setEditItem}
          />

          <EmotionModal
            show={showModal}
            handleClose={() => {
              setShowModal(false);
              setEditItem(null);
            }}
            fetchEmotionData={fetchEmotionData}
            editItem={editItem} // <-- pass this prop!
          />
        </div>
        <EmotionCreatedCard data={data} />
      </div>
    </div>
  );
};

export default EmotionTracker;
