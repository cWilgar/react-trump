import React, { Component } from 'react';
import './App.css';

import Header from '../Header/Header.js';
import Game from '../Game/Game.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Game />
      </div>
    );
  }
}

export default App;
