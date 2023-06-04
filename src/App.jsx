// import { Component } from "react";
// import "./App.css";
// import DeckOfCards from "./DeckOfCards";

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <DeckOfCards />
//       </div>
//     );
//   }
// }

// export default App;

import React, { useState } from "react";
import axios from "axios";

function App() {
  const [players, setPlayers] = useState([]);
  const [cards, setCards] = useState([]);

  const startGame = async () => {
    try {
      const response = await axios.get(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
      const deckId = response.data.deck_id;
      const playerNames = ["Pedro", "Juan"]; // Nombres de los jugadores
      const initialCards = 10; // Número inicial de cartas por jugador

      // Crear jugadores
      const newPlayers = playerNames.map((name) => ({
        name,
        hand: [],
      }));

      // Repartir cartas a los jugadores
      for (let i = 0; i < initialCards; i++) {
        for (let j = 0; j < newPlayers.length; j++) {
          const drawResponse = await axios.get(
            `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
          );
          const card = drawResponse.data.cards[0];
          newPlayers[j].hand.push(card);
        }
      }

      setPlayers(newPlayers);
      setCards(response.data.cards);
    } catch (error) {
      console.error("Error al iniciar el juego:", error);
    }
  };

  const drawCard = async () => {
    const { deck_id } = cards;

    try {
      const drawResponse = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`
      );
      const newCard = drawResponse.data.cards[0];

      // Actualizar el estado del jugador y las cartas
      setPlayers((prevPlayers) => {
        const updatedPlayers = [...prevPlayers];

        for (let i = 0; i < updatedPlayers.length; i++) {
          const player = updatedPlayers[i];

          // Si la carta sirve al jugador, descartar una y reemplazarla
          if (isCardUseful(player.hand, newCard)) {
            const cardToReplace = player.hand[0];
            player.hand = player.hand.slice(1);
            player.hand.push(newCard);
            setCards((prevCards) => [...prevCards, cardToReplace]);
            break;
          }
        }

        return updatedPlayers;
      });
    } catch (error) {
      console.error("Error al obtener una nueva carta:", error);
    }
  };

  const isCardUseful = (hand, newCard) => {
    // Verificar si la nueva carta forma una terna, cuarta o escalera con las cartas existentes
    // Implementa aquí la lógica para determinar si la carta es útil para el jugador
    // Retorna true si la carta es útil, de lo contrario, retorna false
  };

  return (
    <div>
      <h1>Juego de Cartas</h1>
      {players.map((player) => (
        <div key={player.name}>
          <h2>{player.name}</h2>
          <ul>
            {player.hand.map((card) => (
              <li key={card.code}>
                {card.value} of {card.suit}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button onClick={startGame}>Iniciar Juego</button>
      <button onClick={drawCard}>Obtener Nueva Carta</button>
    </div>
  );
}

export default App;
