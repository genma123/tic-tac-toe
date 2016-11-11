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
    case 'JUMP_TO':
      // ...
      return gameState;
    default:
      return gameState;
  }
}

// for possible future use
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares.get(a) && squares.get(a) === squaresget(b) && squares.get(a) === squares.get(c)) {
      return squares.get(a);
    }
  }
  return null;
}
