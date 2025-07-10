const {
  handleUserJoin,
  handleRoomJoin,
  handleSendMessage,
  handleMessageRead,
  handleTyping,
  handleDisconnect,
  handlePrivateMessage,
  handleMessageReaction, // Import new handler
} = require('../controllers/chatController');

const users = {};
const typingUsers = {};
const messages = [];

const configureSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Pass all state (io, socket, users, messages, etc.) to each handler
    handleUserJoin(io, socket, users);
    handleRoomJoin(io, socket, users);
    handleSendMessage(io, socket, users, messages); // Pass messages
    handleMessageRead(io, socket);
    handleMessageReaction(io, socket, users, messages); // Pass users and messages
    handleTyping(io, socket, users, typingUsers);
    handlePrivateMessage(io, socket, users, messages); // Pass messages
    handleDisconnect(io, socket, users, typingUsers);
  });
};

module.exports = configureSocket;