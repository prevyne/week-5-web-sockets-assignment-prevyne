const {
  handleUserJoin,
  handleRoomJoin,
  handleSendMessage,
  handleTyping,
  handleDisconnect,
  handlePrivateMessage,
} = require('../controllers/chatController');

const users = {};
const typingUsers = {};

const configureSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    handleUserJoin(io, socket, users);
    handleRoomJoin(io, socket, users);
    handleSendMessage(io, socket, users);
    handleTyping(io, socket, users, typingUsers);
    handlePrivateMessage(io, socket, users);
    handleDisconnect(io, socket, users, typingUsers);
  });
};

module.exports = configureSocket;