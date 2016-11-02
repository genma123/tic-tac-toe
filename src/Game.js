import React, { Component } from 'react';
import {List, Map, fromJS} from 'immutable';

function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  /* constructor() {
    super();
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  } */
  renderSquare(i) {
    const squares = this.props.squares;
    return <Square value={squares[i]} onClick={() => this.props.onClick(i)} />;
  }
  render() {
    /* const winner = calculateWinner(this.props.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    } */
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

class Game extends React.Component {
  constructor() {
    super();
    this.state = fromJS({
      history: [{
        squares: Array(9).fill(null),
        moveNumber: 0,
      }],
      stepNumber: 0
    });
    /* this.state = {
      history: [{
        squares: Array(9).fill(null),
        moveNumber: 0,
      }],
      stepNumber: 0,
    }; */
  }
  handleClick(i) {
    var history = this.state.get('history');
        // this.state.history.slice(0, this.state.stepNumber + 1);
    var current = history.last() /* [history.length - 1] */;
    var squares = current.get('squares') /* current.squares.slice() */;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    var stepNum = this.state.get('stepNumber');
    var squares = squares.set(i, (stepNumber + 1) % 2 ? 'X' : 'O');
    var histSize =  history.size();
    this.setState(
      Map({
        history: history.push(
          [{
            squares: squares,
            moveNumber: histSize}]
          ),
        stepNumber: histSize
      })
    );
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
