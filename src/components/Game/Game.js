import React, { Component } from 'react';
import TrumpCards from './trumpCards.json';
import shuffle from 'shuffle-array';

function serveCards(cards) {
  const shuffledCards = shuffle(cards, { 'copy': true });
  const numToServe = Math.floor(cards.length/2);

  return [
    shuffledCards.slice(0,numToServe),
    shuffledCards.slice(numToServe)
  ];

} 
var SERVED_CARDS = serveCards(TrumpCards);
debugger;

class Game extends Component {


  render() {
    // TODO: Make multiplayer?
    // var numPlayers = 2;
    // for (var i=0; i < numPlayers; i++) {
    //   rows.push(<PlayersHand player="i" playersCards="this.props.servedCards"/>);
    // }

    return (
      <div className="Game">
      {
      // 	<PlayersHand player="1" isPlayersTurn="{1}" playersCards="this.props.servedCards[0]"/>
      // 	<PlayersHand player="2" isPlayersTurn="{0}" playersCards="this.props.servedCards[1]"/>
      }
      </div>
    );
  }
}

export default Game;
