function drop(board, col, player) {
  for (let row = 5; row >= 0; row--) {
    if (board[row][col] === 0) {
      board[row][col] = player;
      return true;
    }
  }
  return false;
}

function checkWinner(board) {
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 7; c++) {
      if (board[r][c] === 0) continue;
      const player = board[r][c];
      for (let [dr, dc] of directions) {
        let win = true;
        for (let i = 1; i < 4; i++) {
          const nr = r + dr * i, nc = c + dc * i;
          if (
            nr < 0 || nr >= 6 || nc < 0 || nc >= 7 ||
            board[nr][nc] !== player
          ) {
            win = false;
            break;
          }
        }
        if (win) return player;
      }
    }
  }
  return null;
}

exports.getBotMove = async (board) => {
  // Try to win
  for (let col = 0; col < 7; col++) {
    const tempBoard = board.map(row => [...row]);
    if (drop(tempBoard, col, 2) && checkWinner(tempBoard) === 2) {
      return col;
    }
  }

  // Block player win
  for (let col = 0; col < 7; col++) {
    const tempBoard = board.map(row => [...row]);
    if (drop(tempBoard, col, 1) && checkWinner(tempBoard) === 1) {
      return col;
    }
  }

  // Otherwise: center column preference
  return [3, 2, 4, 1, 5, 0, 6].find(c => board[0][c] === 0);
};
