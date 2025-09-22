import React, { useEffect, useState } from "react";
import "./Landing.css";
import AOS from "aos";
import "aos/dist/aos.css";
import LoginModal from "../Modals/LoginModal/LoginModal";
import HowItWorksModal from "../Modals/HowItWork/HowItWork";
import { toast } from "react-toastify";
import { FiX, FiBook, FiBarChart2, FiTrendingUp, FiCheck, FiHelpCircle } from "react-icons/fi";

const Landing = () => {
  const [show, setShow] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

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
  
  const TodayDay = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const dayName = days[today.getDay()];
    return <span>{dayName}</span>;
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShowHowItWorks(false);
    setShow(true);}
  const handleHowItworksModal = () => {
    setShow(false);
    setShowHowItWorks(true);
  }
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
         <div className="bg-circle joy" data-aos="fade-down"></div>
        <div className="bg-circle calm" data-aos="fade-left"></div>
        <div className="bg-circle passion" data-aos="fade-right"></div>
      </div>

      {/* Main Content */}
      <div className="landing-container">
        {/* Left Content */}
        <div
          className="landing-content"
          data-aos="fade-right"
          data-aos-delay="100"
        >
          <h1 data-aos="fade-up" data-aos-delay="150">
            <span>Emotion Diary</span>
            <br />
            <span className="title-gradient">Listen to your heart</span>
            <br />
            Your emotions matter
          </h1>
          <p className="subtitle" data-aos="fade-up" data-aos-delay="250">
            A safe space to track your feelings, understand patterns, and
            cultivate emotional wellbeing.
          </p>

          <div
            className="cta-section"
            data-aos="zoom-in-up"
            data-aos-delay="350"
          >
            <button className="cta-btn primary" onClick={handleShow}>
              <span>Begin Your Journey</span>
            </button>
            <button
              className="cta-btn secondary how_it_works"
              onClick={handleHowItworksModal}
            >
              <FiHelpCircle />
              How It Works
            </button>
          </div>

          <div
            className="testimonial"
            data-aos="fade-left"
            data-aos-delay="500"
          >
            <div className="quote-mark">"</div>
            <p>
              This app helped me understand my emotional patterns like never
              before.
            </p>
            <div className="user">
              <div className="avatar"></div>
              <span>Diary User, 3 months user</span>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div
          className="landing-visual"
          data-aos="fade-left"
          data-aos-delay="200"
        >
          <div
            className="emotion-wheel"
            data-aos="flip-left"
            data-aos-delay="300"
          >
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
                data-aos-delay={400 + i * 100}
              >
                <span className="emoji">{emotion.emoji}</span>
                <span className="label">{emotion.name}</span>
              </div>
            ))}
            <div
              className="wheel-center"
              data-aos="zoom-in-up"
              data-aos-delay="900"
            >
              <TodayDay />
            </div>
          </div>

          <div className="stats-grid" data-aos="fade-up" data-aos-delay="1000">
            <div className="stat-card" data-aos="flip-up" data-aos-delay="1100">
              <div className="stat-icon">📈</div>
              <div className="stat-value">87%</div>
              <div className="stat-label">Better self-awareness</div>
            </div>
            <div className="stat-card" data-aos="flip-up" data-aos-delay="1200">
              <div className="stat-icon">💖</div>
              <div className="stat-value">10K+</div>
              <div className="stat-label">Happy users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal show={show} onClose={handleClose} />

      {/* How It Works Modal */}
      {showHowItWorks && (<HowItWorksModal show={showHowItWorks} onClose={() => setShowHowItWorks(false) } openLogin={handleShow} 
  />
)}

    </div>
  );
};

export default Landing;
