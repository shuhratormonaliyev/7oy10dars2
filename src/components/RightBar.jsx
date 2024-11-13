import React from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
import { FiSettings } from 'react-icons/fi';

const FriendActivity = () => {
  const friends = [
    { id: 1, name: 'Friend 1', status: 'Listening to...' },
    { id: 2, name: 'Friend 2', status: 'Listening to...' },
    { id: 3, name: 'Friend 3', status: 'Listening to...' },
  ];

  return (
    <div className="md:w-[240px] lg:w-[280px] h-full bg-[#000000] text-white p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-base lg:text-lg font-bold">Friend Activity</h2>
        <FiSettings size={20} className="cursor-pointer hover:text-gray-300" />
      </div>

      {/* Description */}
      <p className="text-xs lg:text-sm text-gray-400 py-2">
        Let friends and followers on Spotify see what you're listening to.
      </p>

      {/* Friend List */}
      <div className="space-y-3 lg:space-y-4">
        {friends.map((friend) => (
          <div key={friend.id} className="flex items-center space-x-2 lg:space-x-3">
            <FaUserCircle size={35} className="text-gray-500 lg:w-10 lg:h-10" />
            <div>
              <p className="text-xs lg:text-sm font-semibold">{friend.name}</p>
              <p className="text-[10px] lg:text-xs text-gray-400">{friend.status}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] lg:text-xs text-gray-400 mt-3 lg:mt-4">
        Go to Settings &gt; Social and enable "Share my listening activity on Spotify." You can turn this off at any time.
      </p>

      <button className="mt-3 lg:mt-4 py-1.5 lg:py-2 px-3 lg:px-4 bg-white text-black rounded-full text-sm font-semibold hover:scale-105 transition-transform">
        SETTINGS
      </button>
    </div>
  );
};

export default FriendActivity;
