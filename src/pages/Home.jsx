import React, { useState, useEffect } from "react";
import http from "../axios";
import { useNavigate } from "react-router-dom";
function Home() {
  const [topMix, setTopMix] = useState([]);
  const [forYou, setForYou] = useState([]);
  const [played, setPlayed] = useState([]);
  const [backIn, setBackIn] = useState([]);
  const [yours, setYours] = useState([]);
  const navigate = useNavigate();
  const [music , setMusic] = useState([])
  useEffect(() => {
  http.get('browse/featured-playlists')
  .then(response => {
    setMusic(response.data.playlists.items);
    console.log('featured',response);
    
  })
  .catch(err => {
    console.log(err);
  })
}, [])
  useEffect(() => {
    http
      .get("browse/categories/toplists/playlists")
      .then((response) => {
        setTopMix(response.data.playlists.items);
        console.log('toplists',response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    http
      .get("browse/categories/0JQ5DAqbMKFHOzuVTgTizF/playlists")
      .then((response) => {
        setForYou(response.data.playlists.items);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    http
      .get("browse/categories/0JQ5DAqbMKFQ00XGBls6ym/playlists")
      .then((response) => {
        setPlayed(response.data.playlists.items);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    http
      .get("browse/categories/0JQ5DAqbMKFLVaM30PMBm4/playlists")
      .then((response) => {
        setBackIn(response.data.playlists.items);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    http
      .get("browse/categories/0JQ5DAqbMKFCbimwdOYlsl/playlists")
      .then((response) => {
        setYours(response.data.playlists.items);
        // console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
 
  const handlechange = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-3 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Good afternoon</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
        {music.slice(0, 6).map((playlist, index) => (
          <div
            onClick={() => handlechange(playlist.id)}
            key={index}
            className="bg-gray-800 rounded-lg p-2 md:p-4 flex items-center space-x-2 md:space-x-4 hover:bg-gray-700 transition duration-300 cursor-pointer"
          >
            <img
              src={playlist.images[0]?.url}
              alt={playlist.name}
              className="w-12 h-12 md:w-16 md:h-16 rounded-md"
            />
            <span className="text-sm md:text-lg font-semibold line-clamp-2">{playlist.name}</span>
          </div>
        ))}
      </div>

      {[
        { title: "Your top mixes", data: topMix },
        { title: "MADE FOR YOU", data: forYou },
        { title: "RECENT PLAYED", data: played },
        { title: "JUMP BACK IN", data: backIn },
        { title: "UNIQUELY YOURS", data: yours },
      ].map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-6 md:mb-8">
          <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{section.title}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {section.data.slice(0, 4).map((playlist, index) => (
              <div
                onClick={() => handlechange(playlist.id)}
                key={index}
                className="bg-gray-800 rounded-lg p-2 md:p-4 flex flex-col items-center hover:bg-gray-700 transition duration-300 cursor-pointer"
              >
                <div className="w-full aspect-square mb-2">
                  <img
                    src={playlist.images[0]?.url}
                    alt={playlist.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <span className="text-xs md:text-sm font-medium text-center line-clamp-2">
                  {playlist.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
