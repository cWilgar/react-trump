import React, { Component } from 'react';
import TrumpCards from './trumpCards.json';
import shuffle from 'shuffle-array';

const SERVED_CARDS = serveCards(TrumpCards);
function serveCards(cards) {
  const shuffledCards = shuffle(cards, { 'copy': true });
  const numToServe = Math.floor(cards.length/2);
  return [
    shuffledCards.slice(0,numToServe),
    shuffledCards.slice(numToServe)
  ];

} 

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
      return <UpCard card={this.props.playersCards[0]} />
    }
    else {
      return <DownCard />
    }
  }
}

class UpCard extends Component {
  render() {
    const trumpRatings = this.props.card.ratings
    var trumpRatingRows = []
    for (var category in trumpRatings) {
      trumpRatingRows.push( <TrumpRatingRow category={category} rating={trumpRatings[category]} /> );
    }

    return (
      <div className="trump-card">
        <h3 className="trump-card-header">{this.props.card.name}</h3>
        <img src={this.props.card.picture} />
        <div className="trump-card-ratings">
          <ol>
            {trumpRatingRows}
          </ol>
        </div>
      </div>
    )
  }
}
class TrumpRatingRow extends Component {
  render() {
    return (
      <li>
        <span>{this.props.category}: </span>
        <span>{this.props.rating}</span>
      </li>
    )
  }
}

class DownCard extends Component {
  render() {
    return <div className="trump-downcard"></div>
  }
}

export default Game;
