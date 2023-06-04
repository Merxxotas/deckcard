import React from 'react';
import { Component } from "react";
import axios from "axios";

class DeckOfCards extends Component {
  constructor() {
    super();
    this.getCards = this.getCards.bind(this);
    this.giveMeCard = this.giveMeCard.bind(this);
    this.state = {
      deck_id: "",
      imagesArray: [],
      remaining: "",
    };
  }
  getCards() {
    axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/").then((data) =>
      this.setState({
        deck_id: data.data.deck_id,
        remaining: data.data.remaining,
      })
    );
  }
  componentDidMount() {
    this.getCards();
  }
  giveMeCard() {
    axios
      .get(`https://deckofcardsapi.com/api/deck/${this.state.deck_id}/draw/`)
      .then((data) =>
        this.setState({
          imagesArray: [...this.state.imagesArray, data.data.cards[0].image],
          remaining: data.data.remaining,
        })
      );
  }

  export function isCardUseful(hand, newCard) {
    // Verificar si la nueva carta forma una terna, cuarta o escalera con las cartas existentes
  
    // Obtener los valores y palos de las cartas en la mano del jugador
    const values = hand.map(card => card.value);
    const suits = hand.map(card => card.suit);
  
    // Agregar el valor y palo de la nueva carta a las listas
    values.push(newCard.value);
    suits.push(newCard.suit);
  
    // Verificar si hay una terna de 7s
    const sevens = values.filter(value => value === '7');
    if (sevens.length === 3) {
      return true;
    }
  
    // Verificar si hay una terna de 2s
    const twos = values.filter(value => value === '2');
    if (twos.length === 3) {
      return true;
    }
  
    // Verificar si hay una cuarta o escalera
    const uniqueValues = Array.from(new Set(values)); // Obtener los valores únicos
    uniqueValues.sort(); // Ordenar los valores en orden ascendente
  
    // Verificar si hay una escalera de al menos 4 cartas consecutivas
    for (let i = 0; i < uniqueValues.length - 3; i++) {
      const current = uniqueValues[i];
      const nextThree = uniqueValues.slice(i + 1, i + 4);
  
      if (nextThree.every((value, index) => value === current + (index + 1))) {
        return true;
      }
    }
  
    // Verificar si hay una cuarta
    const fours = uniqueValues.filter(value => {
      const count = values.filter(v => v === value).length;
      return count === 4;
    });
  
    if (fours.length > 0) {
      return true;
    }
  
    return false;
  }
  
  // Uso de la función en un componente de función
  // export default function CardGame() {
  //   // Lógica del juego de cartas y componentes JSX aquí
  //   // ...
  // }

  render() {
    return (
      <div className="deck-board">
        {this.state.remaining ? (
          <button onClick={this.giveMeCard}>Give me a card</button>
        ) : (
          ""
        )}
        <div className="card-list">
          {this.state.imagesArray.map((card, index) => {
            return (
              <img src={card} alt={card} key={index} className="card-image" />
            );
          })}
        </div>
      </div>
    );
  }
}

export default DeckOfCards;
