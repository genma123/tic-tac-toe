import React, { Component } from 'react';

function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  /* renderSquare(i) {
    const squares = this.props.squares;
    return <Square value={squares[i]} onClick={() => this.props.onClick(i)} />;
  } */
  render() {
    return (
      <div>
        <div className="board-row">
          <Square value={this.props.squares[0]} onClick={() => this.props.onClick(0)} />
          <Square value={this.props.squares[1]} onClick={() => this.props.onClick(1)} />
          <Square value={this.props.squares[2]} onClick={() => this.props.onClick(2)} />
        </div>
        <div className="board-row">
          <Square value={this.props.squares[3]} onClick={() => this.props.onClick(3)} />
          <Square value={this.props.squares[4]} onClick={() => this.props.onClick(4)} />
          <Square value={this.props.squares[5]} onClick={() => this.props.onClick(5)} />
        </div>
        <div className="board-row">
          <Square value={this.props.squares[6]} onClick={() => this.props.onClick(6)} />
          <Square value={this.props.squares[7]} onClick={() => this.props.onClick(7)} />
          <Square value={this.props.squares[8]} onClick={() => this.props.onClick(8)} />
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    const { gameState, playSquare, jumpTo } = props;
    /* this.state = gameState.toJS() {
      history: [{
        squares: Array(9).fill(null),
        moveNumber: 0,
      }],
      stepNumber: 0,
    } */;
  }

  // TODO define new function based on redux example with actions
  handleClick2(i) {
    // need to identify player as a function of stepNumber
    playSquare(i, 'X' );
    // determine on which square the click occurred, then call playSquare
    // const toggleClick = id => event => toggleTodo(id);
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
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + ((this.state.stepNumber + 1) % 2 ? 'X' : 'O');
    }
    const moves = history.map((step, i) => {
      const desc = step.moveNumber ?
        'Move #' + step.moveNumber :
        'Game start';
      return (
        <li key={step.moveNumber}>
        <a href="#" onClick={() => this.jumpTo(i)}>{desc}</a>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;
