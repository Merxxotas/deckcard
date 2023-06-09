import React, { useState } from 'react';

const Home = ({ startGame }) => {
  const [deckId, setDeckId] = useState('');

  const handleStartGame = async () => {
    try {
      const response = await fetch('https://deckofcardsapi.com/api/deck/new/');
      const data = await response.json();
      setDeckId(data.deck_id);
      startGame(data.deck_id);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <div>
      <h1>Registro de jugadores</h1>
      <button onClick={handleStartGame}>Comenzar juego</button>
    </div>
  );
};

export default Home;