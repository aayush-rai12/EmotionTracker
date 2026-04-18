import Message from "../models/Message.js";
export const initSocket = (io) => {
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    // user join
    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    // send message (Saves to DB and broadcasts to receiver)
    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, text } = data;

        if (!senderId || !receiverId || !text) return;

        // Persist message to database
        const newMessage = new Message({
          senderId,
          receiverId,
          text,
        });
        await newMessage.save();

        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", {
            ...data,
            _id: newMessage._id,
            createdAt: newMessage.createdAt,
          });
        }
      } catch (error) {
        console.error("Error handling send_message:", error);
      }
    });

    // disconnect
    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
        }
      }
    });
  });
};