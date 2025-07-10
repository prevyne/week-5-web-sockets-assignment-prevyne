import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="message-list">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.type} ${msg.isPrivate ? 'private' : ''}`}>
          {msg.type === 'chat' && (
            <div className="message-meta">
              <span className="sender">{msg.sender}</span>
              <span className="timestamp">{formatTime(msg.timestamp)}</span>
            </div>
          )}
          {msg.message}
          {msg.isPrivate && <span className="private-tag">(Private to {msg.recipient})</span>}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </main>
  );
};

export default MessageList;