import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import UserList from '../components/UserList';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import TypingIndicator from '../components/TypingIndicator';
import RoomList from '../components/RoomList';
import HamburgerMenu from '../components/HamburgerMenu';

const ChatPage = () => {
  const { users, messages, typingUsers, sendMessage, setTyping, currentRoom } = useSocket();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <HamburgerMenu onClick={toggleSidebar} />
      
      {/* This is the main chat view, always visible */}
      <div className="chat-area">
        <h2>Current Room: {currentRoom}</h2>
        <MessageList messages={messages} />
        <TypingIndicator typingUsers={typingUsers} />
        <MessageInput onSendMessage={sendMessage} onTyping={setTyping} />
      </div>

      {/* This sidebar will be an overlay on mobile */}
      <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button onClick={toggleSidebar} className="close-sidebar-btn">&times;</button>
        <RoomList onRoomSelect={toggleSidebar} /> {/* Pass the function */}
        <UserList users={users} onUserSelect={toggleSidebar} /> {/* Pass the function */}
      </div>

      {/* These are for the desktop view only */}
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