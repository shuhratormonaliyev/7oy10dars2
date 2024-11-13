import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { likeTrack, unlikeTrack } from "../redux/actions";
import { Heart } from "lucide-react";

const Likes = () => {
  const likedTracks = useSelector((state) => state.likedTracks);
  const dispatch = useDispatch();
  const [currentTrack, setCurrentTrack] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(audioRef.current.currentTime);
    };
    audioRef.current.addEventListener("timeupdate", updateCurrentTime);
    return () => {
      audioRef.current.removeEventListener("timeupdate", updateCurrentTime);
    };
  }, []);

  const playTrack = (track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentTrack(track);
      audioRef.current.src = track.preview_url;
      audioRef.current.play();
      setIsPlaying(true);
    }
    audioRef.current.volume = volume;
  };

  const handleLikeToggle = (track) => {
    if (likedTracks.some((likedTrack) => likedTrack.id === track.id)) {
      dispatch(unlikeTrack(track.id));
    } else {
      dispatch(likeTrack(track));
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const handleSeek = (amount) => {
    if (audioRef.current) {
      audioRef.current.currentTime += amount;
    }
  };

  const playNextTrack = () => {
    const currentIndex = likedTracks.findIndex((track) => track.id === currentTrack.id);
    const nextTrack = likedTracks[(currentIndex + 1) % likedTracks.length];
    if (nextTrack) {
      playTrack(nextTrack);
    }
  };

  const playPreviousTrack = () => {
    const currentIndex = likedTracks.findIndex((track) => track.id === currentTrack.id);
    const previousTrack = likedTracks[(currentIndex - 1 + likedTracks.length) % likedTracks.length];
    if (previousTrack) {
      playTrack(previousTrack);
    }
  };

  return (
    <div className="bg-gradient-to-b from-purple-900 to-blue-500 min-h-screen text-white pb-24">
      <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-center">Liked Songs</h1>
      <div className="px-2 md:px-6 overflow-x-auto">
        <table className="w-full text-gray-300 text-xs md:text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left pb-2">#</th>
              <th className="text-left pb-2">TITLE</th>
              <th className="text-left pb-2 hidden md:table-cell">ALBUM</th>
              <th className="text-right pb-2">DURATION</th>
              <th className="text-right pb-2">LIKE</th>
            </tr>
          </thead>
          <tbody>
            {likedTracks.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">No liked songs yet.</td>
              </tr>
            ) : (
              likedTracks.map((track, index) => (
                <tr
                  key={track.id}
                  className="hover:bg-white/10 cursor-pointer"
                  onClick={() => playTrack(track)}
                >
                  <td className="py-2">{index + 1}</td>
                  <td>
                    <Link
                      to={`/track/${track.id}`}
                      className="text-green-500 hover:underline"
                    >
                      {track.name}
                    </Link>
                  </td>
                  <td className="text-gray-400 hidden md:table-cell">{track.album.name}</td>
                  <td className="text-right">{formatDuration(track.duration_ms)}</td>
                  <td className="text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeToggle(track);
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      {likedTracks.some((likedTrack) => likedTrack.id === track.id) ? (
                        <Heart className="h-5 w-5 text-red-500" />
                      ) : (
                        <Heart className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t px-4 py-2 m-auto w-full z-50">
          <div className="max-w-screen-xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4 w-[30%]">
              <img
                src={currentTrack.album.images[0]?.url}
                alt={currentTrack.name}
                className="w-14 h-14"
              />
              <div className="hidden sm:block">
                <div className="text-sm text-white hover:underline cursor-pointer">{currentTrack.name}</div>
                <div className="text-xs text-gray-400 hover:underline cursor-pointer">
                  {currentTrack.artists.map((artist) => artist.name).join(", ")}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center w-[40%]">
              <div className="flex items-center gap-6 mb-1">
                <button
                  onClick={playPreviousTrack} 
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
                  </svg>
                </button>
                <button
                  onClick={() => playTrack(currentTrack)}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={playNextTrack} 
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default Likes;
