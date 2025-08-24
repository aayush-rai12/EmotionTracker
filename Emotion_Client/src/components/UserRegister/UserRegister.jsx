import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiLock,
  FiCamera,
  FiX,
  FiHeart,
} from "react-icons/fi";
import "./UserRegister.css";
import LoginModal from "../Modals/LoginModal/LoginModal"; // Fixed import - should be default import
import apiClient from "../utils/apiClient";

const UserRegister = () => {
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeImage = () => {
    setPreviewImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    setError(null);
    return true;
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    if (registrationSuccess) {
      // Reset form after successful registration
      setFormData({
        name: "",
        email: "",
        location: "",
        password: "",
        confirmPassword: "",
      });
      setPreviewImage(null);
      setImageFile(null);
      setRegistrationSuccess(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("location", formData.location);
      data.append("password", formData.password);

      if (imageFile) {
        const base64Image = await fileToBase64(imageFile);
        data.append("profileImage", base64Image);
      }

      const response = await apiClient.post("/auth/userRegister", data);

      console.log("Registration successful:", response.data);
      setRegistrationSuccess(true);
      setShowLoginModal(true);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="emotion-register-container">
      {/* Emotional Background Image */}
      <div className="background-image-wrapper">
        <div className="background-overlay"></div>
        <div className="background-image"></div>
      </div>

      {/* Floating emotional elements */}
      <div className="floating-emojis">
        {["😊", "😌", "❤️", "🤗"].map((emoji, i) => (
          <div
            key={i}
            className="floating-emoji"
            style={{
              left: `${10 + i * 20}%`,
              animationDuration: `${15 + i * 3}s`,
              fontSize: `${20 + i * 4}px`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="register-card">
        <div className="card-header">
          <h1>Create Your Account</h1>
          <p>Begin your emotional wellness journey</p>
        </div>

        {/* Error message display */}
        {error && <div className="error-message">{error}</div>}

        {/* Fixed Image Upload Section */}
        <div className="avatar-upload-container">
          <div
            className={`avatar-preview ${previewImage ? "has-image" : ""}`}
            onClick={() => fileInputRef.current.click()}
          >
            {previewImage ? (
              <div className="image-container">
                <img
                  src={previewImage}
                  alt="Profile preview"
                  className="profile-image"
                  onLoad={(e) => {
                    // Ensure proper image fitting
                    const img = e.target;
                    if (img.naturalWidth > img.naturalHeight) {
                      img.style.width = "100%";
                      img.style.height = "auto";
                    } else {
                      img.style.width = "auto";
                      img.style.height = "100%";
                    }
                  }}
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <div className="upload-prompt">
                <FiCamera className="camera-icon" />
                <span>Add Profile Photo</span>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>

        {/* Registration Form */}
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>
                <FiUser className="input-icon" />
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
            </div>
            <div className="form-group">
              <label>
                <FiMail className="input-icon" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <FiMapPin className="input-icon" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Your location"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <FiLock className="input-icon" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
              />
            </div>
            <div className="form-group">
              <label>
                <FiLock className="input-icon" />
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="register-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register Now"}
            <FiHeart className="btn-icon" />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <button
              className="auth-footer-link"
              onClick={() => setShowLoginModal(true)}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          show={showLoginModal}
          onClose={closeLoginModal}
          prefilledEmail={formData.email}
          message={
            registrationSuccess ? "Registration successful! Please login." : ""
          }
        />
      )}
    </div>
  );
};

export default UserRegister;
