import React from 'react';
import { socket } from '../socket/socket';

const UserList = ({ users }) => {
  return (
    <aside className="user-list">
      <h3>Online ({users.length})</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} {user.id === socket.id && '(You)'}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default UserList;