import React, { useState, useEffect } from 'react';

const App = () => {
  const [deckId, setDeckId] = useState('');
  const [player1Cards, setPlayer1Cards] = useState([]);
  const [player2Cards, setPlayer2Cards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Obtener el ID del mazo barajado
        const shuffleResponse = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const shuffleData = await shuffleResponse.json();
        const deckId = shuffleData.deck_id;
        setDeckId(deckId);

        // Extraer las cartas barajadas para el jugador 1
        const player1Response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=10`);
        const player1Data = await player1Response.json();
        const player1DrawnCards = player1Data.cards;
        setPlayer1Cards(player1DrawnCards);

        // Extraer las cartas barajadas para el jugador 2
        const player2Response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=10`);
        const player2Data = await player2Response.json();
        const player2DrawnCards = player2Data.cards;
        setPlayer2Cards(player2DrawnCards);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCards();
  }, []);

  const drawCard = async () => {
    try {
      // Obtener una carta para cada jugador
      const player1Response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
      const player1Data = await player1Response.json();
      const player1Card = player1Data.cards[0];

      const player2Response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
      const player2Data = await player2Response.json();
      const player2Card = player2Data.cards[0];

      // Verificar si la carta coincide con alguna de las iniciales del jugador 1
      const matchingCardIndex1 = player1Cards.findIndex((card) => card.value === player1Card.value);
      if (matchingCardIndex1 !== -1) {
        // Si coincide, reemplazar la carta correspondiente
        const newPlayer1Cards = [...player1Cards];
        newPlayer1Cards.splice(matchingCardIndex1, 1, player1Card);
        setPlayer1Cards(newPlayer1Cards);
      }

      // Verificar si la carta coincide con alguna de las iniciales del jugador 2
      const matchingCardIndex2 = player2Cards.findIndex((card) => card.value === player2Card.value);
      if (matchingCardIndex2 !== -1) {
        // Si coincide, reemplazar la carta correspondiente
        const newPlayer2Cards = [...player2Cards];
        newPlayer2Cards.splice(matchingCardIndex2, 1, player2Card);
        setPlayer2Cards(newPlayer2Cards);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Juego de cartas</h1>
      <button onClick={drawCard}>Pedir Cartas</button>
      <h2>Jugador 1</h2>
      <div style={{ display: 'flex' }}>
        {player1Cards.map((card) => (
          <img
            key={card.code}
            src={card.image}
            alt={card.code}
            style={{ marginRight: '10px', width: '100px' }}
          />
        ))}
      </div>
      <h2>Jugador 2</h2>
      <div style={{ display: 'flex' }}>
        {player2Cards.map((card) => (
          <img
            key={card.code}
            src={card.image}
            alt={card.code}
            style={{ marginRight: '10px', width: '100px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default App;