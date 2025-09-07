import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {
  FiBook,
  FiBarChart2,
  FiTrendingUp,
  FiShield,
  FiCheck,
} from "react-icons/fi";

const HowItWorksModal = ({ show, onClose, openLogin }) => {
  const isMobile = window.innerWidth < 576;

  // Inline styles
  const styles = {
    modalContent: {
      borderRadius: "12px",
      padding: isMobile ? "1rem" : "2rem",
      maxHeight: "90vh",
      overflowY: "auto",
      margin: 0,
    },
    modalTitle: {
      fontWeight: "bold",
      fontSize: "1.5rem",
      textAlign: "center",
      width: "100%",
      color: "#333",
    },
    step: {
      display: "flex",
      flexDirection: isMobile ? "row" : "row",
      alignItems: isMobile ? "flex-start" : "center",
      gap: "1rem",
      marginBottom: isMobile ? 0 : "1.5rem",
    },
    stepIcon: {
      color: "#6c63ff",
      flexShrink: 0,
      marginTop: isMobile ? 0 : "0.2rem",
    },
    featureGrid: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr 1fr"
        : "repeat(auto-fit, minmax(90px, 1fr))",
      gap: "0.6rem",
      marginTop: "1.5rem",
      fontSize: isMobile? "0.8rem" : "1rem",
    },
    feature: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontWeight: 500,
    },
    checkIcon: {
      color: "#28a745",
    },
    modalFooter: {
      justifyContent: "center",
      paddingButtom:0,
      fontSize: isMobile? "0.8rem" : "1rem",
    },
    modaltext: {
      color: "#555",
      fontSize: isMobile? "0.7rem" : "1rem",
      marginBottom: 0,
    },
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
      contentClassName="no-border-radius"
      scrollable
    >
      <div style={styles.modalContent}>
        <Modal.Header closeButton style={{ borderBottom: "none" }}>
          <Modal.Title style={styles.modalTitle}>
            How Emotion Diary Works
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div style={styles.step}>
            <div style={styles.stepIcon}>
              <FiBook size={24} />
            </div>
            <div>
              <h6>1. Track Daily Emotions</h6>
              <p style={styles.modaltext}>
                Log your emotions daily by selecting how you feel using emojis
                and color-coded indicators.
              </p>
            </div>
          </div>

          <div style={styles.step}>
            <div style={styles.stepIcon}>
              <FiBarChart2 size={24} />
            </div>
            <div>
              <h6>2. Visualize Patterns</h6>
              <p style={styles.modaltext}>
                Get clear visual insights and charts that help you understand
                emotional trends over time.
              </p>
            </div>
          </div>

          <div style={styles.step}>
            <div style={styles.stepIcon}>
              <FiTrendingUp size={24} />
            </div>
            <div>
              <h6>3. Grow Emotionally</h6>
              <p style={styles.modaltext}>
                Receive tailored suggestions and mental wellness tips to boost
                your emotional growth<i> (In-Progress).</i>
              </p>
            </div>
          </div>

          <div style={styles.step}>
            <div style={styles.stepIcon}>
              <FiShield size={24} />
            </div>
            <div>
              <h6>4. Private & Secure</h6>
              <p style={styles.modaltext}>
                Your data is stored securely and remains completely private –
                your emotional journey is yours alone.
              </p>
            </div>
          </div>

          <div style={styles.featureGrid}>
            <div style={styles.feature}>
              <FiCheck style={styles.checkIcon} />
              <span>Privacy Focused</span>
            </div>
            <div style={styles.feature}>
              <FiCheck style={styles.checkIcon} />
              <span>Daily Notifications</span>
            </div>
            <div style={styles.feature}>
              <FiCheck style={styles.checkIcon} />
              <span>Progress Charts</span>
            </div>
            <div style={styles.feature}>
              <FiCheck style={styles.checkIcon} />
              <span>Community Insights</span>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer style={styles.modalFooter}>
          <Button variant="primary" onClick={openLogin} style={{ width: isMobile ? "100%" : "auto",backgroundColor:"#6c63ff",borderColor:"#000000ff" }}>
            Start My Journey
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default HowItWorksModal;
