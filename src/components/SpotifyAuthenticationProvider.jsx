import { createContext, useState, useEffect} from 'react';
const SpotifyAuthContext = createContext();

const SpotifyAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const clientId = process.env.CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI;
  const scopes = 'user-read-private user-read-email';

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('http://localhost:8888/verify', {
        credentials: 'include'
      });
      console.log(response);
      if (response.status === 401) {
          console.log('redirecting to login');
          window.location.href = 'http://localhost:8888/login';
          setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    };
  checkAuth();
    
  }, []);

  const login = () => {
    window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token&show_dialog=true`;
  };

  const logout = () => {
    
  };

  return (
    <SpotifyAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </SpotifyAuthContext.Provider>
  );
};



export { SpotifyAuthProvider, SpotifyAuthContext };
