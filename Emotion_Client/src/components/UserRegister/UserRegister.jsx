import React, { useState, useRef } from "react";
import { FiUser, FiMail, FiMapPin, FiLock, FiCamera, FiX, FiHeart } from "react-icons/fi";
import LoginModal from "../Modals/LoginModal/LoginModal";
import apiClient from "../utils/apiClient";
import "./UserRegister.css";

const UserRegister = () => {
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errors, setErrors] = useState({});
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

    // Clear error for the field as user types
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
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

      // Clear error for profile image
      setErrors((prev) => ({ ...prev, profileImage: "" }));
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["name", "email", "location", "password", "confirmPassword"];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field[0].toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!imageFile) {
      newErrors.profileImage = "Profile image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

      await apiClient.post("/auth/userRegister", data);

      setRegistrationSuccess(true);
      setShowLoginModal(true);
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({ api: err.response?.data?.message || "Registration failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    if (registrationSuccess) {
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

  return (
    <div className="emotion-register-container">
      {/* Background */}
      <div className="background-image-wrapper">
        <div className="background-overlay"></div>
        <div className="background-image"></div>
      </div>

      {/* Emojis */}
      <div className="floating-emojis">
        {["😊", "🤩", "❤️", "🥳", "🧘"].map((emoji, i) => (
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

      {/* Registration Card */}
      <div className="register-card">
        <div className="card-header">
          <h1>Create Your Account</h1>
          <p>Begin your emotional wellness journey</p>
        </div>

        {/* API Error */}
        {errors.api && <div className="error-message">{errors.api}</div>}

        {/* Image Upload */}
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
                <span style={{ fontSize: "50%" }}>Add Profile Photo</span>
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
        {errors.profileImage && (
          <div className="field-error" style={{ textAlign: "center", marginBottom: 10 }}>
            {errors.profileImage}
          </div>
        )}

        {/* Form */}
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
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
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
                placeholder="you@example.com"
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
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
              className={errors.location ? "input-error" : ""}
            />
            {errors.location && <span className="field-error">{errors.location}</span>}
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
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
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
                className={errors.confirmPassword ? "input-error" : ""}
              />
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className="register-btn" disabled={isSubmitting}>
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
