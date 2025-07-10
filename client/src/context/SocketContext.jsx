import React, { createContext, useContext, useState, useEffect } from 'react';
import { socket } from '../socket/socket';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    
    const onReceiveMessage = (msg) => {
      // For debugging private messages
      console.log('Message received from server:', msg); 
      setMessages((prev) => [...prev, { ...msg, type: 'chat' }]);
    };

    const onSystemMessage = (msg) => {
      setMessages((prev) => [...prev, { id: Date.now(), message: msg, type: 'system' }]);
    };

    const onUserList = (userList) => setUsers(userList);
    const onTyping = (typingList) => setTypingUsers(typingList);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', onReceiveMessage);
    socket.on('system_message', onSystemMessage);
    socket.on('user_list', onUserList);
    socket.on('typing_users', onTyping);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive_message', onReceiveMessage);
      socket.off('system_message', onSystemMessage);
      socket.off('user_list', onUserList);
      socket.off('typing_users', onTyping);
    };
  }, []);

  const connect = (username) => {
    socket.connect();
    socket.emit('user_join', username);
  };
  
  const sendMessage = (message) => socket.emit('send_message', message);
  
  const setTyping = (isTyping) => socket.emit('typing', isTyping);

  const sendPrivateMessage = (recipientSocketId, message) => {
    socket.emit('send_private_message', { recipientSocketId, message });
  };

  const value = { 
    isConnected, 
    messages, 
    users, 
    typingUsers, 
    connect, 
    sendMessage, 
    setTyping, 
    sendPrivateMessage 
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};