# Version of the ReactJS Intro Tutorial Using Redux and ImmutableJS #

## Purpose ##
The purpose of this repository is simply to create a bridge between [the Tic-Tac-Toe tutorial on the React website](https://facebook.github.io/react/tutorial/tutorial.html) and [this excellent Redux tutorial on SitePoint](https://www.sitepoint.com/how-to-build-a-todo-app-using-react-redux-and-immutable-js/). I created it as a learning exercise for myself, but I believe it to be a good, simple, but non-trivial example from which anyone hoping to master Redux can benefit. It is my hope that many developers, trying to teach themselves both React and Redux, will add this repository to their "itinerary".
## Objective ##
The objective is simply to introduce Redux into the simple example offered by Facebook&trade;. Having fully grasped the original example, it's just a baby-step to gaining a rudimentary but sound basic knowledge of Redux and how to use it. Anybody with prior experience working with modern JavaScript tutorials should be able to complete this one on their own, and be able to put what they learn to good use going forward. Note that the "finished product" should be indistinguishable from the original, to the user.
## Why Redux? ##
I cannot offer a holistic answer to this question here. However, in this example, apart from the benefit to be gained from advancing one's knowledge, adding Redux to the mix has made this simple single-page application better (for the maintainer if not necessarily for the user) by bringing about a separation of concerns. Presentation logic, and "business logic" (so to speak), which were blended together in a single JS source file, have now been separated and decoupled from each other. Neither has any awareness of the other. The business logic can be tested in isolation, without any need for React tooling. If the product owner wants to add more functionality, the path toward realizing that is clearly marked to anybody with a basic grasp of Redux.
## How I did it ##
This section is an overview of the steps that led to my "finished product" (so to speak). Given my limited prior experience with React and Redux (although I have substantially more experience with Node and Angular) this was a learning experience for me.
### Create React App ###
First some humor. If you haven't already, please take a moment to read [How it feels to learn JavaScript in 2016](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f#.ku4ns3jw6).

So the good news is, you really don't need to learn all that stuff (unless you want to). Instead, use [Create React App](https://github.com/facebookincubator/create-react-app), as I did to bootstrap my repository. (Spoiler alert!) this does not include support for Redux, which I dealt with (easily) later on, as I will shortly explain. NOTE a major change I made was to replace `App.js` with `index.js`
### Original CodePen Example ###
I copied and pasted the code from [CodePen](https://s.codepen.io/ericnakagawa/debug/ALxakj). Given the absence of a "workspace" structure on CodePen, I had to do some tweaking to put everything in the right place, and get the layout and functionality to match the original. Note this code may also exist in a GitHub repository somewhere, but I haven't found or looked for it. I won't go into every detail, please take a minute to compare my version to what's in CodePen.
### Modifying the Original to Use Redux ###
This is the main objective and is discussed in detail below. I was largely guided by [this article by Dan Prince on SitePoint](https://www.sitepoint.com/how-to-build-a-todo-app-using-react-redux-and-immutable-js/).
### "Ejected" Create React App to Support Redux ###
Eventually I had to do this, which I did after looking at [this repository](https://github.com/tstringer/create-react-app-with-redux) before proceeding
## Before Redux ##
This is the original example, showing the "business logic" that co-existed in the same JS file with the rendering logic. *Note that this version of the code seems now to have disappeared from CodePen, but is close to what can be seen in the tutorial:*
```javascript
	class Game extends React.Component {
	  constructor() {
	    super();
	    this.state = {
	      history: [{
	        squares: Array(9).fill(null),
	        moveNumber: 0,
	      }],
	      stepNumber: 0,
	    };
	  }
	  handleClick(i) {
	    var history = this.state.history.slice(0, this.state.stepNumber + 1);
	    var current = history[history.length - 1];
	    const squares = current.squares.slice();
	    if (calculateWinner(squares) || squares[i]) {
	      return;
	    }
	
	    squares[i] = (this.state.stepNumber + 1) % 2 ? 'X' : 'O';
	
	    this.setState({
	      history: history.concat([{
	        squares: squares,
	        moveNumber: history.length,
	      }]),
	      stepNumber: history.length,
	    });
	  }
	  jumpTo(i) {
	    console.log(i);
	    this.setState({
	      stepNumber: i
	    });
	  }
```
This may not look so bad, especially as the logic associated with Tic-Tac-Toe is very simple. However, suppose you wanted to do something much more complicated? It might be advantageous to cleanly separate the logic out, so that it can be independently developed and tested .
## Actions ##
So what are the actions associated with a game of Tic-Tac-Toe? For the tutorial, there are basically two:

 - Click on a square. Depending on whose turn it is, mark the square with either an X or an O, and determine if there is a winner.
 - Click on the list of moves to revisit previous moves.

Well this isn't exactly what happens in Tic-Tac-Toe, but it does represent how the user can interact with the tutorial example.

For Redux, we must define our Actions as follows. Notice that this code has no depedency of its own on Redux or any other library, but must be implemented in a such a way that Redux can use it. So basically we define two functions conforming to the same pattern. Each returns an object consisting of a `type` which is defined here using uppercase letters (customary although I doubt it's necessary) and a `payload`. These two things correspond to the actions described in the two bullets above, plus the associate information necessary to "handle" the action. To play a square, it is necessary to know which square and which player. To revisit a prior move, it only necessary to specify the ordinal index.

```javascript
export function playSquare(index, player) {
  return {
    type: 'PLAY_SQUARE',
    payload: {
      index: index,
      player: player
    }
  };
}

export function visitMove(index) {
  return {
    type: 'VISIT_MOVE',
    payload: {
      index: index
    }
  }
}
```
In this example, the code resides in `actions.js`.

## Reducer ##

The Reducer is the focal point of the application logic. The Reducer "reduces" the action to a change in the application state. Note that the state is represented by an immutable data structure, implemented using [Immutable.js](https://facebook.github.io/immutable-js/) . Note that Immutable.js is not mandatory, but is a widely adopted practice, insofar as the state must be immutable for Redux to work correctly.
```reducer.js

import { List, Map } from 'immutable';

export default function(gameState, action) {
  switch(action.type) {
    case 'PLAY_SQUARE':
      var i = action.payload.index;
      var history = gameState.get('history');
      var squares = history.last().get('squares');
      squares = squares.set(i, action.payload.player);
      var  stepNumber = gameState.get('stepNumber');
      stepNumber++;
      history = history.push(Map({squares: squares, moveNumber: stepNumber}));
      return gameState.set('history', history).set('stepNumber', stepNumber);
    case 'VISIT_MOVE':
+ action.payload.index);
      return gameState.set('stepNumber', action.payload.index);
    default:
      return gameState;
  }
}
```
This code resides in `reducer.js`.
### Testing the Reducer ###
This code can be tested outside of a Web application. Ideally, one would use Mocha/Chai to develop a unit test. In my case, I just copied and pasted the code corresponding to the `playSquare` logic into a Node.js script, and added some impromptu test logic. I output the state to the console. This will help to visualize the game state for anybody having trouble wrapping their head around it.
```javascript
var Immutable = require('immutable');

const gameState = Immutable.fromJS(

{ history: [
	{ squares: Array(9).fill(null),
	  moveNumber: 0, }],
	  stepNumber: 0 });

var i = 3;
var history = gameState.get('history');
var squares = history.last().get('squares');
squares = squares.set(i, 'X');
var  stepNumber = gameState.get('stepNumber');
stepNumber++;
history = history.push(
	Immutable.Map({squares: squares,
					moveNumber: stepNumber}));
console.log(
	JSON.stringify(
		gameState.set('history', history)
			.set('stepNumber', stepNumber), null, 2));
```
Here's the output:

	{
	  "history": [
	    {
	      "squares": [
	        null,
	        null,
	        null,
	        null,
	        null,
	        null,
	        null,
	        null,
	        null
	      ],
	      "moveNumber": 0
	    },
	    {
	      "squares": [
	        null,
	        null,
	        null,
	        "X",
	        null,
	        null,
	        null,
	        null,
	        null
	      ],
	      "moveNumber": 1
	    }
	  ],
	  "stepNumber": 1
	}
## Pulling the Properties Up ##
In the original version, the Game object is basically a holder for the objects that actually "do" something. However, with Redux it will be necessary for the Game to communicate with "external" entities. So as an intermediate step, I added properties to the Game and use those to initialize the State.
```javascript
class Game extends React.Component {
  constructor(props) {
    super(props);
    const { gameState, playSquare, visitMove } = props;
    this.state = gameState.toJS();
  }
```
And in `index.js`:
```javascript
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
```
## Connecting the game to Redux ##
This bit of code is required to connect the Game to the Actions. It's rather hard to describe in straightforward English what this does, just take a look. The documentation is [here](http://redux.js.org/docs/basics/UsageWithReact.html).
```javascript
import { connect } from 'react-redux';
import { playSquare, visitMove } from './actions';
import Game from './Game';

export const WrappedGame = connect(
  function mapStateToProps(state) {
    return { gameState: state };
  },

  function mapDispatchToProps(dispatch) {
    return {
      playSquare: (index, player) => dispatch(playSquare(index, player)),
      visitMove: index => dispatch(visitMove(index))
    }

  }

)(Game);
```
This code resides in `containers.js`.

Now finish connecting everything (in `index.js`):
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Immutable from 'immutable';
import reducer from './reducer';
import { WrappedGame } from './containers';

import './index.css';

const initGameState = Immutable.fromJS(
  { history: [{
      squares: [ null, null, null, null, null, null, null, null, null ], // Array(9).fill(null), NOT COMPATIBLE WITH IE11
      moveNumber: 0,
    }],
    stepNumber: 0
  });

const store = createStore(reducer, initGameState);

ReactDOM.render(
  <Provider store={store}>
    <WrappedGame />
  </Provider>,
  document.getElementById('container')
);
```
## Removing the Game Logic from the Rendering Logic ##
So now we use the `playSquare` and `visitMove` functions, exposed via the React-Redux provider, instead of the "internal" logic, to handle user interaction:
```javascript
  handleClick(i) {
    const squares = this.props.gameState.get('history').last().get('squares').toJS();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    var stepNumber = this.props.gameState.get('stepNumber');
    var player = (stepNumber + 1) % 2 ? 'X' : 'O';
    this.props.playSquare(i, player );
  }

  jumpTo(i) {
    this.props.visitMove(i);
  }
```
Note I left the `calculateWinner` logic, as well as the logic to identify the player based on the parity of the step number, here. Moving all this to the Reducer should be an easy exercise.
## Bonus - Reimplementing the Board as a Pure Function  ##
Because I wanted to flex my newly developed React and ES6 muscles, I reimplemented the Board as a pure function. Of course, this has nothing in particular to do with Redux. You can judge whether this represents an improvement:

Before:
```javascript
class Board extends React.Component {
  renderSquare(i) {
    const squares = this.props.squares;
    return <Square value={squares[i]} onClick={() => this.props.onClick(i)} />;
  }
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```
After:
```javascript
function Board(props) {
    const squares = props.squares;
    const onClick = props.onClick;
    return (
      <div>
        <div className="board-row">
          {squares.slice(0, 3).map((square, k) => <Square key={k} value={square} onClick={() => onClick((k))} />)}
        </div>
        <div className="board-row">
          {squares.slice(3, 6).map((square, k) => <Square key={k+3} value={square} onClick={() => onClick((k+3))} />)}
        </div>
        <div className="board-row">
          {squares.slice(6, 9).map((square, k) => <Square key={k+6} value={square} onClick={() => onClick((k+6))} />)}
        </div>
      </div>
    );
}
```

> Written with [StackEdit](https://stackedit.io/).