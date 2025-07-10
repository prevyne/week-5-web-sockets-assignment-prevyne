import React from 'react';
import { useSocket } from '../context/SocketContext';

const rooms = ['General', 'Technology', 'Sports', 'Random'];

const RoomList = () => {
  const { joinRoom, currentRoom } = useSocket();

  return (
    <aside className="room-list">
      <h3>Channels</h3>
      <ul>
        {rooms.map((room) => (
          <li
            key={room}
            className={room === currentRoom ? 'active' : ''}
            onClick={() => joinRoom(room)}
          >
            # {room}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default RoomList;