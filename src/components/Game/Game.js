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
  constructor(props) {
    super(props);
    this.state = {
      cards: SERVED_CARDS, //the players current card is the one at index 0 of each hand
      currPlayer: 0
    }
  };

  handleCategorySelection(category) {

    const cards = this.state.cards.slice();

    //find best card in the round
    let roundWinner = 0;
    let draw = false;
    for (let i = 1; i < cards.length; i++) {
      const currCard = cards[i][0];
      const currWinnerCard = cards[roundWinner][0];
      if (currCard.ratings[category] > currWinnerCard.ratings[category]) {
        roundWinner = i;
      }
    }

    //hand cards to round winner:
    let cardsForTheTaking = [];
    for (let i = 0; i < cards.length; i++) {
      const currHand = cards[i];
      if (i !== roundWinner) {
        cardsForTheTaking.push(currHand.shift());
      }
    }
    cards[roundWinner] = cards[roundWinner].concat(cardsForTheTaking);

    // update state
    this.setState({
      cards: cards,
      currPlayer: (this.state.currPlayer ? 0 : 1)
    });

    //--checkForGameWinner:
    // if (cards[roundWinner].length )

  }

  renderUpCard(i) {

    const trumpRatings = this.props.card.ratings
    var trumpRatingRows = []
    for (var category in trumpRatings) {
      trumpRatingRows.push( 
        <TrumpRatingRow 
          category={category} 
          rating={trumpRatings[category]} 
          handleClick={() => this.handleCategorySelection(category)}
        /> 
      );
    }

    return (
      <UpCard
        card={this.state.cards[i][0]}
        trumpRatingRows={trumpRatingRows}
      />
    )
  }

  render() {
    // TODO: Make multiplayer?
    // var numPlayers = 2;
    // for (var i=0; i < numPlayers; i++) {
    //   rows.push(<PlayersHand player="i" playersCards="this.props.servedCards"/>);
    // }
    const firstPlayersTurn = (this.state.currPlayer === 0);
    return (
      <div className="Game">

        <div className="players-hand players-hand--first-player">
          <h2>Player 1:</h2>
          { firstPlayersTurn? this.renderUpCard(0) : ( <DownCard /> )}
        </div>

        <div className="players-hand players-hand--second-player">
          <h2>Player 2:</h2>
          { firstPlayersTurn? ( <DownCard /> ) : this.renderUpCard(1) }
        </div>

      </div>
    );
  }

  renderUpCard(i) {
    const card = this.state.cards[i][0];
    return (
      <UpCard
        card={card}
        trumpRatingRows={this.renderTrumpRatings(card.ratings)}
      />
    )
  }

  renderTrumpRatings(ratings) {
    var trumpRatingRows = [];
    for (var category in ratings) {
      trumpRatingRows.push( 
        <TrumpRatingRow 
          category={category} 
          rating={ratings[category]} 
          handleClick={this.handleCategorySelection.bind(this, category)}
        /> 
      );
    }
    return trumpRatingRows;
  }

}

class UpCard extends Component {
  render() {
    return (
      <div className="trump-card">
        <h3 className="trump-card-header">{this.props.card.name}</h3>
        <img src={this.props.card.picture} />
        <div className="trump-card-ratings">
          <ol>
            {this.props.trumpRatingRows}
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
        <a onClick={this.props.handleClick}>
          <span>{this.props.category}: </span>
          <span>{this.props.rating}</span>
        </a>
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
