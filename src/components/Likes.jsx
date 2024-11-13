import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Likes = () => {
  const likedTracks = useSelector(state => state.likedTracks);

  return (
    <div className="bg-black min-h-screen text-white pb-24">
      <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mt-8 text-center">Liked Songs</h1>
      <div className="px-2 md:px-6 overflow-x-auto">
        <table className="w-full text-gray-300 text-xs md:text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left pb-2">TITLE</th>
              <th className="text-left pb-2 hidden md:table-cell">ALBUM</th>
              <th className="text-right pb-2">DURATION</th>
            </tr>
          </thead>
          <tbody>
            {likedTracks.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4">No liked songs yet.</td>
              </tr>
            ) : (
              likedTracks.map((trackId) => (
                <tr key={trackId}>
                  <td>
                    <Link to={`/track/${trackId}`} className="text-green-500 hover:underline">
                      {trackId}
                    </Link>
                  </td>
                  <td className="text-gray-400 hidden md:table-cell">Album Name</td> 
                  <td className="text-right">Duration</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Likes; 