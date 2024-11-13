// src/redux/store.js

import { createStore } from 'redux';
import reducer from './reducer';
import { loadLikedTracks } from './actions';

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('likedTracks');
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return [];
  }
};

const store = createStore(reducer);

// Load liked tracks from local storage and dispatch the action
const likedTracks = loadFromLocalStorage();
store.dispatch(loadLikedTracks(likedTracks));

export default store;