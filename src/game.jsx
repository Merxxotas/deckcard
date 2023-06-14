import React, { useState } from "react";
import { Button, TextField, Grid, Typography } from "@mui/material";
import Notify, { AlertTypes } from "./services/Notify";

const App = () => {
  const [deckId, setDeckId] = useState("");
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [player1Cards, setPlayer1Cards] = useState([]);
  const [player2Cards, setPlayer2Cards] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [matchedCards, setMatchedCards] = useState([]);
  const [player1DiscardedCards, setPlayer1DiscardedCards] = useState([]);
  const [player2DiscardedCards, setPlayer2DiscardedCards] = useState([]);

  const startGame = async () => {
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

      // Extraer las cartas barajadas para el jugador 2
      const player2Response = await fetch(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=10`
      );
      const player2Data = await player2Response.json();
      const player2DrawnCards = player2Data.cards;
      setPlayer2Cards(player2DrawnCards);

      setGameStarted(true);
    } catch (error) {
      console.log(error);
    }
  };

  // ...

  // ...

  const drawCard = async () => {
    try {
      // Obtener una carta para cada jugador
      const player1Response = await fetch(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
      );
      const player1Data = await player1Response.json();
      const player1Card = player1Data.cards[0];

      const player2Response = await fetch(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
      );
      const player2Data = await player2Response.json();
      const player2Card = player2Data.cards[0];

      // Verificar si no hay más cartas en la API
      if (player1Data.remaining === 0 || player2Data.remaining === 0) {
        window.alert("No hay más cartas en la API");
        return;
      }

      // Verificar si el jugador 1 necesita descartar una carta
      let newPlayer1Cards = player1Cards;
      if (player1Cards.length === 10) {
        const cardToDiscard = player1Cards.find(
          (card) =>
            !checkCardValue(card, [...player1Cards, player1Card], player1Name)
        );
        if (cardToDiscard) {
          newPlayer1Cards = player1Cards.filter(
            (card) => card !== cardToDiscard
          );
          setPlayer1DiscardedCards((prevCards) => [
            ...prevCards,
            cardToDiscard,
          ]);
        }
      }

      // Verificar si el jugador 2 necesita descartar una carta
      let newPlayer2Cards = player2Cards;
      if (player2Cards.length === 10) {
        const cardToDiscard = player2Cards.find(
          (card) =>
            !checkCardValue(card, [...player2Cards, player2Card], player2Name)
        );
        if (cardToDiscard) {
          newPlayer2Cards = player2Cards.filter(
            (card) => card !== cardToDiscard
          );
          setPlayer2DiscardedCards((prevCards) => [
            ...prevCards,
            cardToDiscard,
          ]);
        }
      }

      if (
        player1Cards.length === 3 &&
        player1Cards.filter((card) => card.value === player1Card.value)
          .length === 2 &&
        player1Cards.filter((card) => card.value === player1Card.value)
          .length === 3
      ) {
        Notify.sendNotification(
          `${player1Name} es el ganador! Ha completado una terna, terna, cuarta.`
        );
        return;
      }

      if (
        player2Cards.length === 3 &&
        player2Cards.filter((card) => card.value === player2Card.value)
          .length === 2 &&
        player2Cards.filter((card) => card.value === player2Card.value)
          .length === 3
      ) {
        Notify.sendNotification(
          `${player2Name} es el ganador! Ha completado una terna, terna, cuarta.`
        );
        return;
      }

      // Actualizar las cartas de los jugadores
      setPlayer1Cards((prevCards) => [...newPlayer1Cards, player1Card]);
      setPlayer2Cards((prevCards) => [...newPlayer2Cards, player2Card]);

      // Verificar coincidencias de valor
      checkCardValue(player1Card, newPlayer1Cards, player1Name);
      checkCardValue(player2Card, newPlayer2Cards, player2Name);
    } catch (error) {
      console.log(error);
    }
  };

  const checkCardValue = (newCard, playerCards, playerName) => {
    const cardsWithSameValue = playerCards.filter(
      (card) => card.value === newCard.value
    );

    if (cardsWithSameValue.length >= 4) {
      console.log(`¡${playerName} tiene 4 cartas del mismo valor!`);
      return true;
    }

    if (cardsWithSameValue.length === 3) {
      const remainingCards = playerCards.filter(
        (card) => card.value !== newCard.value
      );
      const remainingValues = remainingCards.map((card) => card.value);
      const remainingValueSet = new Set(remainingValues);

      if (!remainingValueSet.has(newCard.value)) {
        console.log(`¡${playerName} tiene 3 cartas del mismo valor!`);
        return true;
      }
    }

    return false;
  };

  return (
    <div>
      <Typography variant="h4">Juego de cartas</Typography>
      {!gameStarted && (
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <TextField
              label="Nombre del jugador 1"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Nombre del jugador 2"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={startGame}>
              Comenzar Juego
            </Button>
          </Grid>
        </Grid>
      )}
      {gameStarted && (
        <div>
          <Button variant="contained" onClick={drawCard}>
            Pedir Cartas
          </Button>
          <Typography variant="h5">{player1Name}</Typography>
          <div style={{ display: "flex" }}>
            {player1Cards.map((card) => (
              <img
                key={card.code}
                src={card.image}
                alt={card.code}
                style={{ marginRight: "10px", width: "100px" }}
              />
            ))}
          </div>
          <Typography variant="h5">{player2Name}</Typography>
          <div style={{ display: "flex" }}>
            {player2Cards.map((card) => (
              <img
                key={card.code}
                src={card.image}
                alt={card.code}
                style={{ marginRight: "10px", width: "100px" }}
              />
            ))}
          </div>
          {matchedCards.length >= 3 && (
            <Typography variant="h6">
              ¡Hay cartas con el mismo número: {matchedCards.join(", ")}!
            </Typography>
          )}

          {matchedCards.length >= 4 && (
            <Typography variant="h6">
              ¡Hay cartas con el mismo número: {matchedCards.join(", ")}!
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
