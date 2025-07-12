import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import UserList from '../components/UserList';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import TypingIndicator from '../components/TypingIndicator';
import RoomList from '../components/RoomList';
import HamburgerMenu from '../components/HamburgerMenu';

const ChatPage = () => {
  const { users, messages, typingUsers, sendMessage, setTyping, currentRoom, logout } = useSocket();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <HamburgerMenu onClick={toggleSidebar} />
      
      <div className="chat-area">
        <div className="chat-header">
          <h2>Current Room: {currentRoom}</h2>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
        <MessageList messages={messages} />
        <TypingIndicator typingUsers={typingUsers} />
        <MessageInput onSendMessage={sendMessage} onTyping={setTyping} />
      </div>

      <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button onClick={toggleSidebar} className="close-sidebar-btn">&times;</button>
        <RoomList onRoomSelect={toggleSidebar} />
        <UserList users={users} onUserSelect={toggleSidebar} />
      </div>

      <div className="desktop-sidebar-left">
        <RoomList />
      </div>
      <div className="desktop-sidebar-right">
        <UserList users={users} />
      </div>
    </>
  );
};

export default ChatPage;