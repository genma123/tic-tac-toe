import { List, Map } from 'immutable';

export default function(state, action) {
  switch(action.type) {
    case 'PLAY_SQUARE':
      var i = action.get('payload').get('index');
      var current = history.last() /* [history.length - 1] */;
      var squares = current.get('squares') /* current.squares.slice() */;
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      var stepNum = this.state.get('stepNumber');
      var squares = squares.set(i, (stepNumber + 1) % 2 ? 'X' : 'O');
      var histSize =  history.size();
      return Map({
        history: history.push(
          [{
            squares: squares,
            moveNumber: histSize}]
          ),
        stepNumber: histSize
      });
    case 'JUMP_TO':
      // ...
    default:
      return state;
  }
}

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
