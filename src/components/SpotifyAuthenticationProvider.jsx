import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
const SpotifyAuthContext = createContext();

const SpotifyAuthenticationProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get('spotifyToken'));
  const clientId = process.env.CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI;
  const scopes = 'user-read-private user-read-email';

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('spotifyToken');

    
  }, []);

  const login = () => {
    window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token&show_dialog=true`;
  };

  const logout = () => {
    setToken(null);
    window.localStorage.removeItem('spotifyToken');
  };

  return (
    <SpotifyAuthContext.Provider value={{ token, login, logout }}>
      {children}
    </SpotifyAuthContext.Provider>
  );
};

export { SpotifyAuthenticationProvider, SpotifyAuthContext };
