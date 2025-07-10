import React, { createContext, useContext, useState, useEffect } from 'react';
import { socket } from '../socket/socket';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('General');

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    
    const onReceiveMessage = (msg) => {
      // When a message is received, if we are not the sender, mark it as read.
      if (msg.senderId !== socket.id) {
        socket.emit('message_read', { messageId: msg.id, senderId: msg.senderId });
      }
      setMessages((prev) => [...prev, { ...msg, type: 'chat' }]);
    };

    const onSystemMessage = (msg) => {
      setMessages((prev) => [...prev, { id: Date.now(), message: msg, type: 'system' }]);
    };

    // --- NEW: Listener for when a message's status changes ---
    const onStatusUpdate = ({ messageId, status }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, status } : msg
        )
      );
    };

    const onUserList = (userList) => setUsers(userList);
    const onTyping = (typingList) => setTypingUsers(typingList);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', onReceiveMessage);
    socket.on('system_message', onSystemMessage);
    socket.on('message_status_update', onStatusUpdate); // Add new listener
    socket.on('user_list', onUserList);
    socket.on('typing_users', onTyping);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive_message', onReceiveMessage);
      socket.off('system_message', onSystemMessage);
      socket.off('message_status_update', onStatusUpdate); // Clean up listener
      socket.off('user_list', onUserList);
      socket.off('typing_users', onTyping);
    };
  }, []);

  const connect = (username) => {
    socket.connect();
    socket.emit('user_join', username);
  };
  
  const joinRoom = (roomName) => {
    socket.emit('join_room', roomName);
    setCurrentRoom(roomName);
    setMessages([]);
  };

  const sendMessage = (message) => socket.emit('send_message', message);
  const setTyping = (isTyping) => socket.emit('typing', isTyping);
  const sendPrivateMessage = (recipientSocketId, message) => socket.emit('send_private_message', { recipientSocketId, message });

  const value = { 
    isConnected, messages, users, typingUsers, currentRoom,
    connect, joinRoom, sendMessage, setTyping, sendPrivateMessage 
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};