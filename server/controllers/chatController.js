// server/controllers/chatController.js

const handleUserJoin = (io, socket, users) => {
  socket.on('user_join', (username) => {
    users[socket.id] = { username, id: socket.id };
    io.emit('user_list', Object.values(users));
    socket.broadcast.emit('system_message', `${username} has joined the chat.`);
    console.log(`${username} joined.`);
  });
};

const handleSendMessage = (io, socket, users) => {
  socket.on('send_message', (message) => {
    const senderUsername = users[socket.id]?.username || 'Anonymous';
    const messageData = {
      id: Date.now(),
      sender: senderUsername,
      message,
      timestamp: new Date().toISOString(),
    };
    io.emit('receive_message', messageData);
  });
};

const handleTyping = (io, socket, users, typingUsers) => {
  socket.on('typing', (isTyping) => {
    const username = users[socket.id]?.username;
    if (!username) return;

    if (isTyping) {
      typingUsers[socket.id] = username;
    } else {
      delete typingUsers[socket.id];
    }
    io.emit('typing_users', Object.values(typingUsers));
  });
};

const handlePrivateMessage = (io, socket, users) => {
  socket.on('send_private_message', ({ recipientSocketId, message }) => {
    try {
      const sender = users[socket.id];
      const recipient = users[recipientSocketId];

      if (!sender || !recipient) {
        console.error('Error: Could not find sender or recipient for private message.');
        return;
      }

      const messageData = {
        id: Date.now(),
        sender: sender.username,
        message,
        recipient: recipient.username,
        isPrivate: true,
        timestamp: new Date().toISOString(),
      };

      io.to(recipientSocketId).emit('receive_message', messageData);
      socket.emit('receive_message', messageData);

    } catch (error) {
      console.error('An error occurred while handling a private message:', error);
    }
  });
};

const handleDisconnect = (io, socket, users, typingUsers) => {
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      io.emit('system_message', `${user.username} has left the chat.`);
      console.log(`${user.username} left.`);
    }
    delete users[socket.id];
    delete typingUsers[socket.id];
    io.emit('user_list', Object.values(users));
    io.emit('typing_users', Object.values(typingUsers));
  });
};

module.exports = {
  handleUserJoin,
  handleSendMessage,
  handleTyping,
  handleDisconnect,
  handlePrivateMessage,
};