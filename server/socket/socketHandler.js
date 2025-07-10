const {
  handleUserJoin,
  handleSendMessage,
  handleTyping,
  handleDisconnect,
  handlePrivateMessage, // Import the new handler
} = require('../controllers/chatController');

const users = {};
const typingUsers = {};

const configureSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Pass io, socket, and state to each handler
    handleUserJoin(io, socket, users);
    handleSendMessage(io, socket, users);
    handleTyping(io, socket, users, typingUsers);
    handlePrivateMessage(io, socket, users); // Use the new handler
    handleDisconnect(io, socket, users, typingUsers);
  });
};

module.exports = configureSocket;