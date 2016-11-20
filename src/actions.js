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
