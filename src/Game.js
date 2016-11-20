import React, { Component } from 'react';

function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

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

class Game extends React.Component {
  constructor(props) {
    super(props);
    // console.log("props: " + JSON.stringify(props));
    const { gameState, playSquare, visitMove } = props;
  }

  // TODO define new function based on redux example with actions
  handleClick(i) {
    // need to identify player as a function of stepNumber
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
  render() {
    const history = this.props.gameState.get('history');
    const stepNumber = this.props.gameState.get('stepNumber');
    const squares = history.get(stepNumber).get('squares').toJS();
    const winner = calculateWinner(squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + ((this.props.gameState.get('stepNumber') + 1) % 2 ? 'X' : 'O');
    }
    const moves = history.map((step, i) => {
      const desc = step.get('moveNumber') ?
        'Move #' + step.get('moveNumber') :
        'Game start';
      return (
        <li key={step.get('moveNumber')}>
        <a href="#" onClick={() => this.jumpTo(i)}>{desc}</a>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={squares}
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
