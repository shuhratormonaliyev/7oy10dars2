export const LIKE_TRACK = 'LIKE_TRACK';
export const UNLIKE_TRACK = 'UNLIKE_TRACK';
export const LOAD_LIKED_TRACKS = 'LOAD_LIKED_TRACKS';

export const likeTrack = (track) => ({
  type: LIKE_TRACK,
  payload: track,
});

export const unlikeTrack = (trackId) => ({
  type: UNLIKE_TRACK,
  payload: trackId,
});

export const loadLikedTracks = (tracks) => ({
  type: LOAD_LIKED_TRACKS,
  payload: tracks,
});

const fetchLikedSongs = async () => {
  const token = localStorage.getItem("spotify_token");

  if (!token) {
    console.error("No token found. Please log in again.");
    alert("Please log in to access your liked songs.");
    return;
  }

  try {
    const response = await https.get('https://api.spotify.com/v1/me/tracks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Fetched liked songs:", response.data);
    dispatch(setTracks(response.data.items));
  } catch (error) {
    console.error("Error fetching liked songs:", error.response ? error.response.data : error.message);
    alert("Failed to fetch liked songs. Please try again later.");
  }
};