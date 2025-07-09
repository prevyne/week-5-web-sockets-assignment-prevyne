import React from 'react';
import { useSocket } from '../context/SocketContext';
import UserList from '../components/UserList';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import TypingIndicator from '../components/TypingIndicator';

const ChatPage = () => {
  const { users, messages, typingUsers, sendMessage, setTyping } = useSocket();

  return (
    <div className="chat-container">
      <UserList users={users} />
      <div className="chat-area">
        <MessageList messages={messages} />
        <TypingIndicator typingUsers={typingUsers} />
        <MessageInput onSendMessage={sendMessage} onTyping={setTyping} />
      </div>
    </div>
  );
};

export default ChatPage;