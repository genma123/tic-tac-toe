import { connect } from 'react-redux';
import { playSquare, jumpTo } from './actions';
import Game from './Game';

export const WrappedGame = connect(
  function mapStateToProps(state) {
    return { gameState: state };
  },

  function mapDispatchToProps(dispatch) {
    return {
      playSquare: (index, player) => dispatch(playSquare(index, player))
      // jummpTo TODO
    }

  }

)(Game);
