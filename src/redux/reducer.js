// src/redux/reducer.js

import { LIKE_TRACK, UNLIKE_TRACK, LOAD_LIKED_TRACKS } from './actions';

const initialState = {
  likedTracks: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LIKE_TRACK:
      return {
        ...state,
        likedTracks: [...state.likedTracks, action.payload],
      };
    case UNLIKE_TRACK:
      return {
        ...state,
        likedTracks: state.likedTracks.filter(track => track.id !== action.payload),
      };
    case LOAD_LIKED_TRACKS:
      return {
        ...state,
        likedTracks: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;