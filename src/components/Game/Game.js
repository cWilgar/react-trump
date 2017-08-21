import React, { Component } from 'react';
import './Game.css';

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

    const roundWinner = calculateRoundWinner(category, cards);
    // if it's a draw, return:
    if (roundWinner === false) {
      alert('That was a draw! Pick a different category' );
      return
    }
    //hand cards to round winner:
    let winnersNewCards = [];
    for (let i = 0; i < cards.length; i++) {
      if (i !== roundWinner) {
        const loosingHand = cards[i];
        winnersNewCards.push(loosingHand.shift());
      }
    }
    cards[roundWinner] = cards[roundWinner].concat(winnersNewCards);

    // update state
    this.setState({
      cards: cards,
      currPlayer: roundWinner
    });
  }

  render() {
    // check if game is over
    const gameOver = checkIfGameOver(this.state.currPlayer, this.state.cards);
    if (gameOver) {
      return <h1>Player {this.state.currPlayer+1} is the winner! Refresh the page to start again.</h1>
    }
    // otherwise render game
    const firstPlayersTurn = (this.state.currPlayer === 0);
    return (
      <div className="Game">
        <h1>
          Current Player: {this.state.currPlayer+1}
        </h1>

        <div className="players-hand players-hand--first-player">
          <h2>Player 1:</h2>
          <p> Cards: { this.state.cards[0].length }</p>
          { firstPlayersTurn? this.renderUpCard(0) : ( <DownCard /> ) }
        </div>

        <div className="players-hand players-hand--second-player">
          <h2>Player 2:</h2>
          <p> Cards: { this.state.cards[1].length }</p>
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
        trumpRatings={this.renderTrumpRatings(card.ratings)}
      />
    )
  }

  renderTrumpRatings(ratings) {
    var trumpRatingRows = [];
    for (var category in ratings) {
      trumpRatingRows.push( 
        <TrumpRatingRow 
          key={category}
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
        <img src={this.props.card.picture} alt={this.props.card.name}/>
        <div className="trump-card-ratings">
          <ol>
            {this.props.trumpRatings}
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

function calculateRoundWinner(category, cards) {
  let roundWinner = 0;
  let draw = false;
  for (let i = 1; i < cards.length; i++) {
    const currCardRating = parseInt(cards[i][0].ratings[category], 10);
    const currWinnerRating = parseInt(cards[roundWinner][0].ratings[category], 10);
    if (currCardRating > currWinnerRating) {
      roundWinner = i;
    }
    else if (currCardRating === currWinnerRating) {
      draw = true;
    }

    return (draw ? false : roundWinner);
  }
}
function checkIfGameOver(currWinner, cards) {
    for (let i = 0; i < cards.length; i++) {
      if (i !== currWinner && cards[i].length > 0) {
        return false;
      }
    }
    return true;
}

export default Game;
