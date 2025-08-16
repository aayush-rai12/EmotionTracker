import React, { useState } from "react";
import "./EmotionTracker.css";
import apiClient from "../utils/apiClient";
import { useEffect } from "react";
import { use } from "react";

const ToggleSwitch = ({ isPublic, onToggle }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async () => {
    try {
      setIsLoading(true);
      await onToggle();
    } catch (error) {
      console.error("Toggle failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <label className="emotion_toggle_switch">
      <input
        type="checkbox"
        checked={isPublic}
        onChange={handleChange}
        disabled={isLoading}
      />
      <span className={`switch ${isLoading ? "loading" : ""}`} />
    </label>
  );
};

const EmotionTable = ({ data, setData, setShowModal, setEditItem }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  // Edit function (will be implemented later)
  const handleEdit = (id) => {
    alert(`Edit function will be implemented for ID: ${id}`);
    const entry = data.find((item) => item._id === id);
    if (entry) {
      console.log("Editing entry:", entry);
      setEditItem(entry);
      setShowModal(true);
    }
  };

  // Delete function
  const handleDelete = async (ids) => {
    const confirmMessage = Array.isArray(ids)
      ? `Are you sure you want to delete ${ids.length} entries? This action cannot be undone.`
      : "Are you sure you want to delete this emotion entry? This action cannot be undone.";

    const userConfirmation = window.confirm(confirmMessage);

    if (!userConfirmation) return;

    const idArray = Array.isArray(ids) ? ids : [ids];

    try {
      const deletionResults = await Promise.all(
        idArray.map(async (id) => {
          try {
            const response = await apiClient.delete(
              `/user/deleteEmotionCard/${id}`
            );
            return { id, success: response.status === 200 };
          } catch (error) {
            console.error(`Failed to delete item ${id}:`, error);
            return { id, success: false };
          }
        })
      );

      const successfulDeletes = deletionResults
        .filter((result) => result.success)
        .map((result) => result.id);

      if (successfulDeletes.length > 0) {
        setData((prevData) =>
          prevData.filter((item) => !successfulDeletes.includes(item._id))
        );
        setSelectedItems((prevSelected) =>
          prevSelected.filter((id) => !successfulDeletes.includes(id))
        );
        console.log(
          `Successfully deleted ${successfulDeletes.length} item(s).`
        );
      }

      const failedCount = idArray.length - successfulDeletes.length;
      if (failedCount > 0) {
        alert(`Failed to delete ${failedCount} item(s). Please try again.`);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to process delete request. Please try again.");
    }
  };

  // Update handleToggle to be more optimistic
  const handleToggle = async (id) => {
    try {
      const itemToToggle = data.find((item) => item._id === id);
      if (!itemToToggle) return;

      // Optimistically update UI
      setData(
        data.map((item) =>
          item._id === id ? { ...item, isPublic: !item.isPublic } : item
        )
      );

      // update here card status is visible or not
      const response = await apiClient.patch(
        `/user/toggleEmotionStatus/${id}`,
        {
          isPublic: !itemToToggle.isPublic,
        }
      );

      if (response.status !== 200) {
        setData(
          data.map((item) =>
            item._id === id
              ? { ...item, isPublic: itemToToggle.isPublic }
              : item
          )
        );
        throw new Error("Toggle failed");
      }
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  // Handle select all checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedItems(dataArray.map((item) => item._id));
    } else {
      setSelectedItems([]);
    }
  };
  // Handle individual item selection
  const handleSelectItem = (id) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((item) => item !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };
  const dataArray = Array.isArray(data) ? data : Object.values(data);

  // Ensure data is an array
  if (dataArray.length === 0) {
    return (
      <div className="no-data-message">
        <p>No emotions recorded yet. Start tracking your feelings!</p>
        <p className="text-neutral-700">
          Click the button below to add your first entry.
        </p>
        <button className="add_emotion_btn" onClick={setShowModal}>
          Add your first entry<i className="fas fa-plus"></i>
        </button>
      </div>
    );
  }

  // Update the bulk delete handler

  return (
    <div className="table-responsive">
      <div>
        {selectedItems.length > 1 && (
          <div className="selected-actions">
            <span>{selectedItems.length} items selected</span>
            <button
              className="delete-selected-btn"
              onClick={() => handleDelete(selectedItems)}
            >
              Delete Selected <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        )}
      </div>
      <table className="emotion_table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedItems.length === dataArray.length}
                onChange={handleSelectAll}
              />
            </th>
            <th>Feeling</th>
            <th>Mood</th>
            <th>Intensity</th>
            <th>Trigger Reason</th>
            <th>Date</th>
            <th>Preferred Activity</th>
            <th>Partner Reacted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dataArray.map((item) => (
            console.log("Rendering item:", item),
            <tr key={item._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item._id)}
                  onChange={() => handleSelectItem(item._id)}
                />
              </td>
              <td>{item.feelings}</td>

              <td>
                <span style={{ backgroundColor: `${item?.moodColor}50` }}
                  className={`mood-tag ${
                    item.mood ? item.mood.toLowerCase() : ""
                  }`}
                >
                  {item.mood || "N/A"}
                </span>
              </td>
              <td>
                <span
                  className={`intensity-tag ${item.intensity
                    .toLowerCase()
                    .replace(/\s/g, "_")}`}
                >
                  {item.intensity}
                </span>
              </td>
              <td>{item.triggerReason}</td>
              <td>{new Date().toLocaleDateString()}</td>
              <td>{item.preferredActivity}</td>
              <td>{item.partnerImpact}</td>
              <td>
                <div className="emotion_action_buttons">
                  <button
                    className="emotion_edit_btn"
                    onClick={() => {
                      handleEdit(item._id);
                      setEditItem(item);
                      setShowModal(true);
                    }}
                  >
                    <i className="fa-regular fa-pen-to-square"></i>
                  </button>
                  <ToggleSwitch
                    isPublic={item.isPublic}
                    onToggle={() => handleToggle(item._id)}
                  />
                  <button
                    className="emotion_delete_btn"
                    onClick={() => handleDelete(item._id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmotionTable;
