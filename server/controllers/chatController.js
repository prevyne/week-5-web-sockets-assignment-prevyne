// server/controllers/chatController.js

const handleUserJoin = (io, socket, users) => {
  socket.on('user_join', (username) => {
    users[socket.id] = { username, id: socket.id };
    // By default, join a 'General' room
    socket.join('General');
    socket.currentRoom = 'General';
    io.emit('user_list', Object.values(users));
    socket.emit('system_message', `You joined the 'General' chat room.`);
    socket.to('General').emit('system_message', `${username} has joined the chat.`);
  });
};

const handleRoomJoin = (io, socket, users) => {
  socket.on('join_room', (roomName) => {
    const username = users[socket.id]?.username;
    if (!username) return; // Add a check for the user

    // Leave the previous room
    socket.leave(socket.currentRoom);
    socket.to(socket.currentRoom).emit('system_message', `${username} has left the room.`);
    
    // Join the new room
    socket.join(roomName);
    socket.currentRoom = roomName;
    socket.emit('system_message', `You joined the '${roomName}' chat room.`);
    socket.to(roomName).emit('system_message', `${username} has joined the room.`);
  });
};

const handleSendMessage = (io, socket, users) => {
  socket.on('send_message', (message) => {
    if (!socket.currentRoom) return;

    const messageData = {
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      message,
      timestamp: new Date().toISOString(),
    };
    io.to(socket.currentRoom).emit('receive_message', messageData);
  });
};

const handleTyping = (io, socket, users, typingUsers) => {
  socket.on('typing', (isTyping) => {
    if (!socket.currentRoom) return;
    const username = users[socket.id]?.username;
    if (!username) return;

    if (isTyping) {
      typingUsers[socket.id] = username;
    } else {
      delete typingUsers[socket.id];
    }
    socket.to(socket.currentRoom).emit('typing_users', Object.values(typingUsers));
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
      if(socket.currentRoom) {
        socket.to(socket.currentRoom).emit('system_message', `${user.username} has left the chat.`);
      }
    }
    delete users[socket.id];
    delete typingUsers[socket.id];
    io.emit('user_list', Object.values(users));
    io.emit('typing_users', Object.values(typingUsers));
  });
};

module.exports = {
  handleUserJoin,
  handleRoomJoin,
  handleSendMessage,
  handleTyping,
  handleDisconnect,
  handlePrivateMessage,
};