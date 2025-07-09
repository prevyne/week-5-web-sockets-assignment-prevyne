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
};