import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import http from "../axios";
import { useDispatch, useSelector } from 'react-redux';
import { likeTrack, unlikeTrack } from '../redux/actions';

function Details() {
  const [data, setData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(new Audio());
  const { id } = useParams();
  const dispatch = useDispatch();
  const likedTracks = useSelector(state => state.likedTracks);

  useEffect(() => {
    http
      .get(`playlists/${id}`)
      .then((resp) => {
        setData(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      handleNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
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
  };

  const handlePrevious = () => {
    const currentIndex = data.tracks.items.findIndex(
      item => item.track.id === currentTrack.id
    );
    const previousTrack = data.tracks.items[currentIndex - 1]?.track;
    if (previousTrack) {
      playTrack(previousTrack);
    }
  };

  const handleNext = () => {
    const currentIndex = data.tracks.items.findIndex(
      item => item.track.id === currentTrack.id
    );
    const nextTrack = data.tracks.items[currentIndex + 1]?.track;
    if (nextTrack) {
      playTrack(nextTrack);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setProgress(newTime);
    audioRef.current.currentTime = newTime;
  };

  const handleProgressMouseDown = () => {
    if (isPlaying) {
      audioRef.current.pause();
    }
  };

  const handleProgressMouseUp = () => {
    if (isPlaying) {
      audioRef.current.play();
    }
  };

  const handleLikeToggle = (track) => {
    if (likedTracks.some(likedTrack => likedTrack.id === track.id)) {
      dispatch(unlikeTrack(track.id));
    } else {
      dispatch(likeTrack(track));
    }
  };
  if (!data) return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="loading loading-ring loading-lg"></span>
    </div>
  );

  return (
    <div className="bg-black min-h-screen text-white pb-24">
      <div className="bg-gradient-to-b from-green-500/30 to-black p-4 md:p-8">
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
          <img
            src={data?.images?.[0]?.url}
            alt="Playlist cover"
            className="w-40 h-40 md:w-60 md:h-60 shadow-2xl mx-auto sm:mx-0"
          />
          <div className="text-center sm:text-left">
            <p className="text-xs md:text-sm uppercase">{data?.type}</p>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mt-2">{data?.name}</h1>
            <p className="mt-4 md:mt-6 text-xs md:text-sm text-gray-300">{data?.description}</p>
            <p className="mt-2 text-xs md:text-sm text-gray-300">
              {data?.tracks?.total} tracks • {data?.followers?.total} followers
            </p>
          </div>
        </div>
      </div>

      <div className="px-2 md:px-6 overflow-x-auto">
        <table className="w-full text-gray-300 text-xs md:text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left pb-2 w-8 md:w-12">#</th>
              <th className="text-left pb-2">TITLE</th>
              <th className="text-left pb-2 hidden md:table-cell">ALBUM</th>
              <th className="text-right pb-2">DURATION</th>
              <th className="text-right pb-2">LIKE</th>
            </tr>
          </thead>
          <tbody>
            {data?.tracks?.items.map((item, index) => (
              <tr 
                key={index} 
                className={`hover:bg-white/10 group cursor-pointer
                  ${currentTrack?.id === item.track.id ? 'bg-white/20' : ''}`}
                onClick={() => playTrack(item.track)}
              >
                <td className="py-2 md:py-3">
                  {currentTrack?.id === item.track.id ? (
                    <div className="w-3 h-3 md:w-4 md:h-4">
                      {isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z" />
                        </svg>
                      )}
                    </div>
                  ) : (
                    index + 1
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-2 md:gap-4">
                    <img
                      src={item.track.album.images[2]?.url}
                      alt={item.track.name}
                      className="w-8 h-8 md:w-10 md:h-10"
                    />
                    <div className="flex flex-col max-w-[150px] sm:max-w-[200px] md:max-w-none">
                      <span className={`truncate ${currentTrack?.id === item.track.id ? 'text-green-500' : 'text-white'}`}>
                        {item.track.name}
                      </span>
                      <span className="text-xs md:text-sm text-gray-400 truncate">
                        {item.track.artists.map(artist => artist.name).join(', ')}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="text-gray-400 hidden md:table-cell truncate">{item.track.album.name}</td>
                <td className="text-right">{formatDuration(item.track.duration_ms)}</td>
                <td className="text-right">
                  <button onClick={() => handleLikeToggle(item.track)} className="text-gray-400 hover:text-white">
                    {likedTracks.some(likedTrack => likedTrack.id === item.track.id) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t px-4 py-2 m-auto w-full z-50">
          <div className="max-w-screen-xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4 w-[30%]">
              <img
                src={currentTrack.album.images[2]?.url}
                alt={currentTrack.name}
                className="w-14 h-14"
              />
              <div className="hidden sm:block">
                <div className="text-sm text-white hover:underline cursor-pointer">
                  {currentTrack.name}
                </div>
                <div className="text-xs text-gray-400 hover:underline cursor-pointer">
                  {currentTrack.artists.map(artist => artist.name).join(', ')}
                </div>
              </div>
              <button className="text-gray-400 hover:text-white hidden sm:block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center w-[40%]">
              <div className="flex items-center gap-6 mb-1">
                <button onClick={handlePrevious} className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
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
                <button onClick={handleNext} className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-end gap-2 w-[30%]">
                <button onClick={handleToggleMute} className="text-gray-400 hover:text-white">
                  {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-gray-600 rounded-full cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:invisible
                    hover:[&::-webkit-slider-thumb]:visible"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Details;