import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Player = () => {
  const [bingoCard, setBingoCard] = useState([]);
  const [currentSong, setCurrentSong] = useState('');

  useEffect(() => {
    socket.on('song', (song) => {
      setCurrentSong(song);
    });
  }, []);

  return (
    <div>
      <h1>Current Song: {currentSong}</h1>
      <div className="bingo-card">
        {bingoCard.map((song, index) => (
          <div key={index} className="bingo-cell">
            {song}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Player;
