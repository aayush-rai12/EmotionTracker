import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function ChatRoomModal({ show, onClose, chatWithUserId }) {
  // Modal content for chat room
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Chat Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Chatting with user ID: {chatWithUserId}</p>
        {/* Chat interface goes here */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default ChatRoomModal;