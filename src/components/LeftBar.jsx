import React from 'react';
import { AiOutlineHome, AiOutlineSearch } from 'react-icons/ai';
import { BiLibrary, BiPlusCircle } from 'react-icons/bi';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const playlists = [
    "Chill Mix", 
    "Insta Hits", 
    "Your Top Songs 2021", 
    "Mellow Songs", 
    "Anime Lofi & Chillhop Music", 
    "BG Afro “Select” Vibes", 
    "Afro “Select” Vibes", 
    "Happy Hits!", 
    "Deep Focus", 
    "Instrumental Study", 
    "OST Compilations", 
    "Nostalgia for old souled millennials", 
    "Mixed Feelings"
  ];
  const navigate = useNavigate()
  return (
    <div className="md:w-[240px] lg:w-[280px] h-full bg-black text-white flex flex-col p-2 md:p-4 space-y-2 md:space-y-4">
      <div className="space-y-4" onClick={()=>{navigate('/')}}>
        {/* Main Navigation */}
        <div className="flex items-center space-x-2 md:space-x-3 hover:text-white text-gray-300 cursor-pointer">
          <AiOutlineHome size={24} />
          <span className="hidden md:inline text-sm font-semibold">Home</span>
        </div>
        <div className="flex items-center space-x-2 md:space-x-3 hover:text-white text-gray-300 cursor-pointer">
          <AiOutlineSearch size={24} />
          <span className="hidden md:inline text-sm font-semibold">Search</span>
        </div>
        <div className="flex items-center space-x-2 md:space-x-3 hover:text-white text-gray-300 cursor-pointer">
          <BiLibrary size={24} />
          <span className="hidden md:inline text-sm font-semibold">Your Library</span>
        </div>
      </div>

      <hr className="border-t border-gray-700" />

      {/* Playlist Management */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 md:space-x-3 hover:text-white text-gray-300 cursor-pointer">
          <BiPlusCircle size={24} />
          <span className="hidden md:inline text-sm font-semibold">Create Playlist</span>
        </div>
        <div className="flex items-center space-x-2 md:space-x-3 hover:text-white text-gray-300 cursor-pointer">
          <FaHeart size={24} className="text-purple-600" />
          <span onClick={()=>{navigate('/like')}} className="hidden md:inline text-sm font-semibold">Liked Songs</span>
        </div>
      </div>

      <hr className="border-t border-gray-700" />

      {/* Playlists - Hidden on mobile */}
      <div className="hidden md:flex flex-1 flex-col overflow-y-auto scrollbar-hide mt-2 md:mt-4 space-y-2">
        {playlists.map((playlist, index) => (
          <div 
            key={index} 
            className="text-xs md:text-sm text-gray-400 hover:text-white cursor-pointer truncate"
          >
            {playlist}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
