import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
// import App from './App';
import Game from './Game';
import './index.css';

const initGameState = Immutable.fromJS(
  { history: [{
      squares: Array(9).fill(null),
      moveNumber: 0,
    }],
    stepNumber: 0
  });

ReactDOM.render(
  <Game gameState={initGameState} />,
  document.getElementById('container')
);
