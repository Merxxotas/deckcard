import React, { useState } from "react";
import Home from "./home";
import Game from "./game";

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [deckId, setDeckId] = useState("");

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
