import React from 'react';
import { SocketProvider, useSocket } from './context/SocketContext';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import './index.css'; // Add your styles

const AppContent = () => {
  const { isConnected } = useSocket();
  return isConnected ? <ChatPage /> : <LoginPage />;
};

const App = () => {
  return (
    <SocketProvider>
      <AppContent />
    </SocketProvider>
  );
};

export default App;