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

class Game extends Component {


  render() {
    // TODO: Make multiplayer?
    // var numPlayers = 2;
    // for (var i=0; i < numPlayers; i++) {
    //   rows.push(<PlayersHand player="i" playersCards="this.props.servedCards"/>);
    // }

    return (
      <div className="Game">
      	<PlayersHand player="1" isPlayersTurn={1} playersCards={SERVED_CARDS[0]}/>
      	<PlayersHand player="2" isPlayersTurn={0} playersCards={SERVED_CARDS[1]}/>
      </div>
    );
  }
}


class PlayersHand extends Component {
  render() {
    if (this.props.isPlayersTurn) {
      return <UpCard />
    }
    else {
      return <DownCard />
    }
  }
}


class UpCard extends Component {
  render() {
    return <div>UPCARD</div>
  }
}

class DownCard extends Component {
  render() {
    return <div>DOWNCARD</div>
  }
}

export default Game;
