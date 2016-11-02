export function playSquare(index, player) {
  return {
    type: 'PLAY_SQUARE',
    payload: {
      index: index,
      player: player
    }
  };
}

export function jumpTo(index) {
  return {
    type: 'JUMP_TO',
    payload: {
      index: index
    }
  }
}
