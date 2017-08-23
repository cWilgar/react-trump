import React, { Component } from 'react';
import crown from './crown.svg';
import './Game.css';

import shuffle from 'shuffle-array';

const WP_URI = process.env.REACT_APP_WP_URI;
const CHEAT = true; // useful for debugging (rather than crawling through scope objects in debugger)

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: null, //the players current card is the one at index 0 of each hand
      currPlayer: 0
    }
  };

  componentDidMount() {
    const request = WP_URI + '/wp-json/wp-trumps/v1/cards/';

    fetch(request).then(function(response) {
      var contentType = response.headers.get("content-type");
      if(contentType && contentType.includes("application/json")) {
        return response.json();
      }
      throw new TypeError("Response not json, but " + contentType);
    })
    .then((json) => { this.serveCards(json) })
    .catch(function(error) { console.log(error); });
  };

  serveCards(cards) {
    const shuffledCards = shuffle(cards, { 'copy': true });
    const numToServe = Math.floor(cards.length/2);
    const serve = [
      shuffledCards.slice(0,numToServe),
      shuffledCards.slice(numToServe)
    ];
    this.setState({
      cards: serve,
    });

  }

  render() {
    // check if the cards have been loaded
    if (!this.state.cards) {
      return <p>One moment please...</p>;
    }
    // check if game is over
    const gameOver = checkIfGameOver(this.state.currPlayer, this.state.cards);
    if (gameOver) {
      return <h1>Player {this.state.currPlayer+1} is the winner! Refresh the page to start again.</h1>
    }
    // otherwise render game
    return (
      <div className="Game">
        <h1>
          Current Player: {this.state.currPlayer+1}
        </h1>

        <div className="players-hand players-hand--first-player">
          <h2>Player 1:</h2>
          <p> Cards: { this.state.cards[0].length }</p>
          {this.renderTrumpCard(0)}
        </div>

        <div className="players-hand players-hand--second-player">
          <h2>Player 2:</h2>
          <p> Cards: { this.state.cards[1].length }</p>
          {this.renderTrumpCard(1)}
        </div>

      </div>
    );
  }

  renderTrumpCard(i) {
    const card = this.state.cards[i][0];
    if (this.state.currPlayer === i) {
      return (
        <UpCard
          card={card}
          trumpRatings={this.renderTrumpRatings(card.ratings)}
        />
      )
    }
    else if (CHEAT) {
      return (
        <UpCard
          card={card}
          trumpRatings={this.renderTrumpRatings(card.ratings, false)}
          cheating={true}
        />
      )
    }
    else {
      return (
        <DownCard/>
      )
    }
  }

  renderTrumpRatings(ratings, clickable = true) {
    var trumpRatingRows = [];
    for (var category in ratings) {
      trumpRatingRows.push( 
        <TrumpRatingRow 
          key={category}
          category={category}
          rating={ratings[category]} 
          handleClick={
            clickable ? this.handleCategorySelection.bind(this, category) : ''
          }
        />
      );
    }
    return trumpRatingRows;
  }

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
  
}

class UpCard extends Component {
  render() {

    const picture = this.props.card.picture;
    const img = ( picture ? 
        <img 
          src={picture.url}
          srcSet={
            picture.sizes.medium +" "+picture.sizes['medium-width']+","+
            picture.sizes.large +" "+picture.sizes['large-width']+","
          }
          alt={picture.title}
        />
    :
        <img src={crown} alt={picture.title} />
    )

    return (
      <div className={"trump-card" + (this.props.cheating ? " trump-card--cheat":"")}>
        <h3 className="trump-card-header">{this.props.card.name}</h3>
        <div className="trump-card-img-wrapper">
          {img}
        </div>
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
