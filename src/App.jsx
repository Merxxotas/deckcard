// // import { Component } from "react";
// // import "./App.css";
// // import DeckOfCards from "./DeckOfCards";



// // export default App;

// import React, { useState } from "react";
// import axios from "axios";
// import DeckOfCards from "./DeckOfCards";

// // class App extends Component {
  
// // }

// function App () {
//   const [players, setPlayers] = useState([]);
//   const [cards, setCards] = useState([]);

//   const startGame = async () => {
//     try {
//       const response = await axios.get(
//         "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
//       );
//       const deckId = response.data.deck_id;
//       const playerNames = ["Pedro", "Juan"]; // Nombres de los jugadores
//       const initialCards = 10; // Número inicial de cartas por jugador

//       // Crear jugadores
//       const newPlayers = playerNames.map((name) => ({
//         name,
//         hand: [],
//       }));

//       // Repartir cartas a los jugadores
//       for (let i = 0; i < initialCards; i++) {
//         for (let j = 0; j < newPlayers.length; j++) {
//           const drawResponse = await axios.get(
//             `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
//           );
//           const card = drawResponse.data.cards[0];
//           newPlayers[j].hand.push(card);
//         }
//       }

//       setPlayers(newPlayers);
//       setCards(response.data.cards);
//     } catch (error) {
//       console.error("Error al iniciar el juego:", error);
//     }
//   };

//   const drawCard = async () => {
//     const { deck_id } = cards;

//     try {
//       const drawResponse = await axios.get(
//         `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`
//       );
//       const newCard = drawResponse.data.cards[0];

//       // Actualizar el estado del jugador y las cartas
//       setPlayers((prevPlayers) => {
//         const updatedPlayers = [...prevPlayers];

//         for (let i = 0; i < updatedPlayers.length; i++) {
//           const player = updatedPlayers[i];

//           // Si la carta sirve al jugador, descartar una y reemplazarla
//           if (isCardUseful(player.hand, newCard)) {
//             const cardToReplace = player.hand[0];
//             player.hand = player.hand.slice(1);
//             player.hand.push(newCard);
//             setCards((prevCards) => [...prevCards, cardToReplace]);
//             break;
//           }
//         }

//         return updatedPlayers;
//       });
//     } catch (error) {
//       console.error("Error al obtener una nueva carta:", error);
//     }
//   };

//   const isCardUseful = (hand, newCard) => {
//     // Verificar si la nueva carta forma una terna, cuarta o escalera con las cartas existentes
//     // Implementa aquí la lógica para determinar si la carta es útil para el jugador
//     // Retorna true si la carta es útil, de lo contrario, retorna false
//   };

//   return (
//     <div>
//       <h1>Juego de Cartas</h1>
//       {/* {players.map((player) => (
//         <div key={player.name}>
//           <h2>{player.name}</h2>
//           <ul>
//             {player.hand.map((card) => (
//               <li key={card.code}>
//                 {card.value} of {card.suit}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))} */}
//       <div className="App">
//       <DeckOfCards />
//     </div>
//       <button onClick={startGame}>Iniciar Juego</button>
//       <button onClick={drawCard}>Obtener Nueva Carta</button>
//     </div>
//   );
// }

// export default App;

// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

// function Home({ personas, setPersonas }) {
//   const [nombrePersona1, setNombrePersona1] = useState('');
//   const [nombrePersona2, setNombrePersona2] = useState('');
//   const [personasIds, setPersonasIds] = useState([]);

//   useEffect(() => {
//     const fetchPersonaId = async () => {
//       try {
//         const response = await fetch('https://deckofcardsapi.com/api/deck/new/');
//         const data = await response.json();
//         setPersonasIds((prevIds) => [...prevIds, data.deck_id]);
//       } catch (error) {
//         console.error('Error al obtener el ID de la persona:', error);
//       }
//     };
  
//     if (nombrePersona1 && nombrePersona2) {
//       fetchPersonaId();
//     }
//   }, [nombrePersona1, nombrePersona2, setPersonasIds]);

//   const registrarNombres = () => {
//     if (nombrePersona1 && nombrePersona2) {
//       setPersonas([
//         ...personas,
//         { nombre: nombrePersona1, id: personasIds[personas.length] },
//         { nombre: nombrePersona2, id: personasIds[personas.length + 1] },
//       ]);
//       setNombrePersona1('');
//       setNombrePersona2('');
//     }
//   };

//   return (
//     <div>
//       <h1>Registro de Personas</h1>
//       <label>Persona 1: </label>
//       <input
//         type="text"
//         value={nombrePersona1}
//         onChange={(e) => setNombrePersona1(e.target.value)}
//       />
//       <br />
//       <label>Persona 2: </label>
//       <input
//         type="text"
//         value={nombrePersona2}
//         onChange={(e) => setNombrePersona2(e.target.value)}
//       />
//       <br />
//       <button onClick={registrarNombres}>Registrar</button>
//       <br />
//       <Link to="/personas-registradas">Ver personas registradas</Link>
//     </div>
//   );
// }

// function PersonasRegistradas({ personas }) {
//   if (!personas || personas.length === 0) {
//     return <p>No personas available.</p>;
//   }

//   return (
//     <div>
//       <h2>Personas registradas:</h2>
//       {personas.map((persona) => (
//         <p key={persona.id}>{persona.nombre}</p>
//       ))}
//     </div>
//   );
// }

// function App() {
//   const [personas, setPersonas] = useState([]);

//   return (
//     <Router>
//       <div>
//       <Routes>
//   <Route
//     path="/"
//     element={<Home personas={personas} setPersonas={setPersonas} />}
//   />
//   <Route
//     path="/personas-registradas"
//     element={<PersonasRegistradas personas={personas} />}
//   />
// </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
import React, { useState } from 'react';
import Home from './home';
import Game from './game';

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [deckId, setDeckId] = useState('');

  const startGame = (id) => {
    setGameStarted(true);
    setDeckId(id);
  };

  return (
    <div className="App">
      {!gameStarted ? <Home startGame={startGame} /> : <Game deckId={deckId} />}
    </div>
  );
};

export default App;
