import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";  <-- remove if unused
import "./Landing.css";
import AOS from "aos";
import "aos/dist/aos.css";
import LoginModal from "../Modals/LoginModal/LoginModal";
import { toast } from "react-toastify";

const Landing = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      easing: "ease-out-quart",
    });
  }, []);

  useEffect(() => {
    const msg = localStorage.getItem("sessionExpiredMessage");
    if (msg) {
      toast.warn(msg, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      localStorage.removeItem("sessionExpiredMessage");
    }
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const emotions = [
    { name: "Joy", emoji: "😊", color: "#FFD166" },
    { name: "Sadness", emoji: "😢", color: "#6A8EAE" },
    { name: "Anger", emoji: "😠", color: "#EF476F" },
    { name: "Anxiety", emoji: "😰", color: "#A37A74" },
    { name: "Excitement", emoji: "🤩", color: "#FF9A47" },
    { name: "Peace", emoji: "😌", color: "#06D6A0" },
  ];

  return (
    <div className="emotion-landing">
      {/* Background Decorations */}
      <div className="emotion-bg">
        <div className="bg-circle joy"></div>
        <div className="bg-circle calm"></div>
        <div className="bg-circle passion"></div>
      </div>

      {/* Main Content */}
      <div className="landing-container">
        {/* Left Content */}
        <div className="landing-content" data-aos="fade-right">
          <h1>
            <span className="title-gradient">Listen to your heart</span>
            <br />
            Your emotions matter
          </h1>
          <p className="subtitle">
            A safe space to track your feelings, understand patterns, and
            cultivate emotional wellbeing.
          </p>

          <div className="cta-section" data-aos="fade-up" data-aos-delay="200">
            <button className="cta-btn primary" onClick={handleShow}>
              <span>Begin Your Journey</span>
            </button>
            <button className="cta-btn secondary">How It Works</button>
          </div>

          <div className="testimonial" data-aos="fade-up" data-aos-delay="400">
            <div className="quote-mark">“</div>
            <p>
              This app helped me understand my emotional patterns like never
              before.
            </p>
            <div className="user">
              <div className="avatar"></div>
              <span>Aayush Rai, 3 months user</span>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="landing-visual" data-aos="fade-left">
          <div className="emotion-wheel">
            {emotions.map((emotion, i) => (
              <div
                key={i}
                className="emotion-petal"
                style={{
                  backgroundColor: emotion.color,
                  transform: `rotate(${i * 60}deg) translateY(-120px) rotate(-${i * 60}deg)`,
                }}
                data-aos="zoom-in"
                data-aos-delay={300 + i * 100}
              >
                <span className="emoji">{emotion.emoji}</span>
                <span className="label">{emotion.name}</span>
              </div>
            ))}
            <div className="wheel-center" data-aos="zoom-in" data-aos-delay="900">
              <span>Today</span>
            </div>
          </div>

          <div className="stats-grid" data-aos="fade-up" data-aos-delay="1000">
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-value">87%</div>
              <div className="stat-label">Better self-awareness</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💖</div>
              <div className="stat-value">10K+</div>
              <div className="stat-label">Happy users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal show={show} onClose={handleClose} />
    </div>
  );
};

export default Landing;
