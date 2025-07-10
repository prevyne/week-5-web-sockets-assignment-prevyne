import React from 'react';
import { socket } from '../socket/socket';
import { useSocket } from '../context/SocketContext';

const UserList = ({ users }) => {
  const { sendPrivateMessage } = useSocket();

  const handleUserClick = (user) => {
    if (user.id === socket.id) return;
    const message = prompt(`Send a private message to ${user.username}:`);
    if (message) {
      sendPrivateMessage(user.id, message);
    }
  };

  return (
    <aside className="user-list">
      <h3>Online ({users.length})</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => handleUserClick(user)} style={{cursor: 'pointer'}}>
            {user.username} {user.id === socket.id && '(You)'}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default UserList;