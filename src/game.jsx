import React, { useState, useEffect } from "react";
import { countBy } from "lodash";

const App = () => {
  const [deckId, setDeckId] = useState("");
  const [player1Cards, setPlayer1Cards] = useState([]);
  const [player2Cards, setPlayer2Cards] = useState([]);
  const [mano, setMano] = useState(Array(10).fill(null));
  const frecuencia1 = countBy(mano);
  const frecuencia2 = countBy(player2Cards);

  const mapHand = (playercards) => {
    {
      const newHand = [...mano]
      playercards.map((cards, index) => {      
        newHand[index] = cards.value   
        setMano(newHand)
      });
    }
  };

  const mapFrecuency = (f) =>{
    Object.entries(f).map(([elemento, frecuencia]) => {
      if (frecuencia<=1){
        
      }
    })
  }

 

  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Obtener el ID del mazo barajado
        const shuffleResponse = await fetch(
          "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
        );
        const shuffleData = await shuffleResponse.json();
        const deckId = shuffleData.deck_id;
        setDeckId(deckId);

        // Extraer las cartas barajadas para el jugador 1
        const player1Response = await fetch(
          `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=10`
        );
        const player1Data = await player1Response.json();
        const player1DrawnCards = player1Data.cards;
        setPlayer1Cards(player1DrawnCards);
        mapHand(player1Cards)
        console.log(mano);
        console.log(frecuencia1)
         
        // Extraer las cartas barajadas para el jugador 2
        const player2Response = await fetch(
          `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=10`
        );
        const player2Data = await player2Response.json();
        const player2DrawnCards = player2Data.cards;
        setPlayer2Cards(player2DrawnCards);
          // mapHand(player2Cards)
      } catch (error) {
        console.log(error);
      }
    };

    fetchCards();
  }, []);

  const drawCard = async () => {
    try {
      // Obtener una carta para cada jugador
      const player1Response = await fetch(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
      );
      const player1Data = await player1Response.json();
      const player1Card = player1Data.cards[0];
      setPlayer1Cards((prevCards) => [...prevCards, player1Card]);

      const player2Response = await fetch(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
      );
      const player2Data = await player2Response.json();
      const player2Card = player2Data.cards[0];
      setPlayer2Cards((prevCards) => [...prevCards, player2Card]);

      // Verificar coincidencias de valor
      checkCardValue(player1Card, player1Cards);
      checkCardValue(player2Card, player2Cards);
    } catch (error) {
      console.log(error);
    }
  };

  const checkCardValue = (newCard, playerCards) => {
    const cardsWithSameValue = playerCards.filter(
      (card) => card.value === newCard.value
    );

    if (cardsWithSameValue.length >= 4) {
      console.log(`¡Jugador tiene 4 cartas del mismo valor!`);
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
    // <div>
    //   <h2>Frecuencia del Array</h2>{" "}
    //   <ul>
    //     {" "}
    //     {Object.entries(frecuencia1).map(([elemento, frecuencia]) => (
    //       <li key={elemento}>
    //         {" "}
    //         {elemento}: {frecuencia}{" "}
    //       </li>
    //     ))}{" "}
    //   </ul>{" "}
    // </div>
  );
};

export default App;

export default App;