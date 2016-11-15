import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Immutable from 'immutable';
// import App from './App';
// import Game from './Game';
import reducer from './reducer';
import { WrappedGame } from './containers';

import './index.css';

const initGameState = Immutable.fromJS(
  { history: [{
      squares: Array(9).fill(null),
      moveNumber: 0,
    }],
    stepNumber: 0
  });

const store = createStore(reducer, initGameState);

ReactDOM.render(
  <Provider store={store}>
    <WrappedGame />
    {/* <Game gameState={store.getState()} />, */}
  </Provider>,
  document.getElementById('container')
);
