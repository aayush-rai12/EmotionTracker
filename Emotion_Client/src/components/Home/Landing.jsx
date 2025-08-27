import React, { useEffect } from "react";
import "./Landing.css";
import AOS from "aos";
import "aos/dist/aos.css";
import LoginModal from "../Modals/LoginModal/LoginModal";

const Landing = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      easing: "ease-out-quart",
    });
  }, []);

  // Enhanced emotion data with color psychology
  const emotions = [
    { name: "Joy", emoji: "😊", color: "#FFD166" }, // Yellow - happiness
    { name: "Sadness", emoji: "😢", color: "#6A8EAE" }, // Blue - calm/trust
    { name: "Anger", emoji: "😠", color: "#EF476F" }, // Red - passion/strength
    { name: "Anxiety", emoji: "😰", color: "#A37A74" }, // Brown - stability
    { name: "Excitement", emoji: "🤩", color: "#FF9A47" }, // Orange - friendly
    { name: "Peace", emoji: "😌", color: "#06D6A0" }, // Green - growth
  ];

  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className="emotion-landing">
      {/* Emotional background elements */}
      <div className="emotion-bg">
        <div className="bg-circle joy"></div>
        <div className="bg-circle calm"></div>
        <div className="bg-circle passion"></div>
      </div>
      {/* Main content */}
      <div className="landing-container">
        {/* Left content */}
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

        {/* Right content */}
        <div className="landing-visual" data-aos="fade-left">
          <div className="emotion-wheel">
            {emotions.map((emotion, i) => (
              <div
                key={i}
                className="emotion-petal"
                style={{
                  backgroundColor: emotion.color,
                  transform: `rotate(${i * 60}deg) translateY(-120px) rotate(-${
                    i * 60
                  }deg)`,
                }}
                data-aos="zoom-in"
                data-aos-delay={300 + i * 100}
              >
                <span className="emoji">{emotion.emoji}</span>
                <span className="label">{emotion.name}</span>
              </div>
            ))}
            <div
              className="wheel-center"
              data-aos="zoom-in"
              data-aos-delay="900"
            >
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
      <LoginModal show={show} onClose={handleClose} />{" "}
    </div>
  );
};

export default Landing;
