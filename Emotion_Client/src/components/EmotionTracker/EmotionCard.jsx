import React from "react";
import { useState } from "react";
import "./EmotionTracker.css";

function EmotionCreatedCard({data}) {
    const [hoverColor, setHoverColor] = useState(null);
    const [bgColor, setBgColor] = useState("#fcb1b1");

    const startHeartRain = (index) => {
    const card = document.querySelector(`.card-${index}`);
    if (!card) return;

    const button = card.querySelector(".like-button");
    const buttonRect = button.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    const offsetX = buttonRect.left - cardRect.left + button.offsetWidth / 2;
    const numberOfHearts = 30;

    let styleElement = document.getElementById("dynamic-heart-styles");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "dynamic-heart-styles";
      document.head.appendChild(styleElement);
    }

    for (let i = 0; i < numberOfHearts; i++) {
      const heart = document.createElement("span");
      heart.classList.add("heart");
      heart.innerHTML = "❤️";
      heart.style.position = "absolute";
      heart.style.left = `${offsetX}px`;
      heart.style.bottom = `30px`;
      heart.style.fontSize = `${Math.random() * 10 + 14}px`;

      const delay = Math.random() * 0.4;
      const duration = 1.3 + Math.random() * 0.1;
      const xScatter = (Math.random() - 0.5) * 350;

      const animationName = `floatHeart-${index}-${i}`;
      const keyframes = `
        @keyframes ${animationName} {
          0% {
            transform: translate(0, 0) scale(0.8) rotate(0deg);
            opacity: 0.7;
          }
          100% {
            transform: translate(${xScatter}px, -300px) scale(1.9) rotate(${
        Math.random() * 360
      }deg);
            opacity: 0;
          }
        }
      `;
      styleElement.sheet.insertRule(
        keyframes,
        styleElement.sheet.cssRules.length
      );
      heart.style.animation = `${animationName} ${duration}s linear ${delay}s forwards`;
      card.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, duration * 1000 + delay * 1000);
    }
  };

  return (
    <div
      className="cards-container"
      style={{
        background: hoverColor || bgColor,
        transition: "background 0.5s ease-in-out",
      }}
    >
      {data.map(
        (card, index) => (
          // console.log("object.keys(card)", card),
          (
            <div
              className={`emotion-card card-${index}`}
              key={card._id || card.id || index}
              data-key={card._id || card.id || index}
              style={{ backgroundColor: card.moodColor }}
              onMouseEnter={() => setHoverColor(card.moodColor)}
              onMouseLeave={() => setHoverColor(null)}
            >
              <div className="emotion-quote">
                <p>{card.feelings || "N/A"}</p>
              </div>

              <div className="emotion-info">
                <div className="info-block">
                  <span className="label">Intensity</span>
                  <span className="intensity-tag intensity">
                    {card.intensity || "N/A"}
                  </span>
                </div>
                <div className="info-block">
                  <span className="label">Mood</span>
                  <span className="value mood-tag">{card.mood || "N/A"}</span>
                </div>
                <div className="info-block">
                  <span className="label">Reaction Trigger</span>
                  <span className="value">{card.triggerReason || "N/A"}</span>
                </div>
                <div className="info-block">
                  <span className="label">Preferred Activity</span>
                  <span className="value">
                    {card.preferredActivity || "N/A"}
                  </span>
                </div>
              </div>

              <div className="footer-row">
                <span className="footer-text">
                  date:{" "}
                  {card.createdDate || card.createdAt?.slice(0, 10) || "N/A"}
                </span>
                <div className="footer-like">
                  <button
                    className="like-button"
                    onClick={() => startHeartRain(index)}
                  >
                    Like
                  </button>
                </div>
                <span className="footer-text" style={{ textAlign: "right" }}>
                  Liked by: You & other 8
                </span>
              </div>
            </div>
          )
        )
      )}
    </div>
  );
}

export default EmotionCreatedCard;
