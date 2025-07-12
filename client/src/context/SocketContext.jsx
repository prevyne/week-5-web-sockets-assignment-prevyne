import React, { createContext, useContext, useState, useEffect } from 'react';
import { socket } from '../socket/socket';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('chat_token'));
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('General');

  const API_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

  useEffect(() => {
    if (isAuthenticated) {
      socket.connect();
    }

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    
    const onConnectError = (err) => {
      console.error('Connection Error:', err.message);
      if (err.message.includes('Authentication error')) {
        localStorage.removeItem('chat_token');
        setIsAuthenticated(false);
      }
    };
    
    const onReceiveMessage = (msg) => {
      if (msg.senderId !== socket.id) {
        socket.emit('message_read', { messageId: msg.id, senderId: msg.senderId });
      }
      setMessages((prev) => [...prev, { ...msg, type: 'chat' }]);
    };

    const onSystemMessage = (msg) => {
      setMessages((prev) => [...prev, { id: Date.now(), message: msg, type: 'system' }]);
    };

    // --- THIS IS THE CORRECTED PART ---
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
    socket.on('connect_error', onConnectError);
    socket.on('receive_message', onReceiveMessage);
    socket.on('system_message', onSystemMessage);
    socket.on('message_status_update', onStatusUpdate); // Listener re-added
    socket.on('user_list', onUserList);
    socket.on('typing_users', onTyping);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('receive_message', onReceiveMessage);
      socket.off('system_message', onSystemMessage);
      socket.off('message_status_update', onStatusUpdate); // Cleanup re-added
      socket.off('user_list', onUserList);
      socket.off('typing_users', onTyping);
    };
  }, [isAuthenticated]);

  const register = async (username, password) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }
  };

  const login = async (username, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }
    
    const { token } = await res.json();
    localStorage.setItem('chat_token', token);
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    localStorage.removeItem('chat_token');
    setIsAuthenticated(false);
    socket.disconnect();
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
    isConnected, isAuthenticated, messages, users, typingUsers, currentRoom,
    register, login, logout, joinRoom, sendMessage, setTyping, sendPrivateMessage 
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};