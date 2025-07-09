import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className="message-list">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.type}`}>
          {msg.type === 'chat' && <span className="sender">{msg.sender}: </span>}
          {msg.message}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </main>
  );
};

export default MessageList;