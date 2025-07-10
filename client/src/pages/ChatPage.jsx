import React from 'react';
import { useSocket } from '../context/SocketContext';
import UserList from '../components/UserList';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import TypingIndicator from '../components/TypingIndicator';
import RoomList from '../components/RoomList';

const ChatPage = () => {
  const { users, messages, typingUsers, sendMessage, setTyping, currentRoom } = useSocket();

  return (
    <div className="chat-container">
      <RoomList />
      <div className="chat-area">
        <h2>Current Room: {currentRoom}</h2>
        <MessageList messages={messages} />
        <TypingIndicator typingUsers={typingUsers} />
        <MessageInput onSendMessage={sendMessage} onTyping={setTyping} />
      </div>
      <UserList users={users} />
    </div>
  );
};

export default ChatPage;