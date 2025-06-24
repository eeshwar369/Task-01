const GameModel = require('../models/game.model');
const { publishGameEvent } = require('../kafka/producer');

let matchmakingQueue = [];
let activeGames = new Map();

exports.matchPlayer = async (user) => {
  const existing = matchmakingQueue.find(p => p.id === user.id);
  if (!existing) matchmakingQueue.push(user);

  return new Promise((resolve) => {
    setTimeout(async () => {
      if (matchmakingQueue.length >= 2) {
        const [p1, p2] = matchmakingQueue.splice(0, 2);
        const game = await GameModel.createGame(p1.id, p2.id);
        activeGames.set(game.id, { board: Array(6).fill().map(() => Array(7).fill(0)), currentPlayer: p1.id });
        publishGameEvent({ type: 'match_found', players: [p1.username, p2.username] });
        resolve(game);
      } else {
        const [p1] = matchmakingQueue.splice(0, 1);
        const game = await GameModel.createGame(p1.id, null);
        activeGames.set(game.id, { board: Array(6).fill().map(() => Array(7).fill(0)), currentPlayer: p1.id, vsBot: true });
        publishGameEvent({ type: 'bot_match', player: p1.username });
        resolve({ ...game, vsBot: true });
      }
    }, 10000);
  });
};

exports.makeMove = async (gameId, column, isBot = false) => {
  const game = activeGames.get(gameId);
  if (!game || column < 0 || column > 6) return { error: 'Invalid' };

  for (let row = 5; row >= 0; row--) {
    if (game.board[row][column] === 0) {
      const player = isBot ? 2 : 1;
      game.board[row][column] = player;
      game.currentPlayer = player === 1 ? 2 : 1;

      const winner = checkWinner(game.board);
      if (winner) {
        await GameModel.completeGame(gameId, winner);
        publishGameEvent({ type: 'game_over', gameId, winner });
        return { board: game.board, winner, gameId, vsBot: game.vsBot };
      }

      return { board: game.board, gameId, vsBot: game.vsBot };
    }
  }

  return { error: 'Column full' };
};

exports.getGame = async (gameId) => {
  const game = activeGames.get(gameId);
  return game ? { board: game.board, currentPlayer: game.currentPlayer } : await GameModel.getGame(gameId);
};

function checkWinner(board) {
  const directions = [[0,1], [1,0], [1,1], [1,-1]];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 7; c++) {
      if (board[r][c] === 0) continue;
      const player = board[r][c];
      for (let [dr, dc] of directions) {
        let win = true;
        for (let i = 1; i < 4; i++) {
          const nr = r + dr * i, nc = c + dc * i;
          if (nr < 0 || nr >= 6 || nc < 0 || nc >= 7 || board[nr][nc] !== player) {
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
