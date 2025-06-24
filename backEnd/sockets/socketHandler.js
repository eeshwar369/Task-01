const gameService = require('../services/game.service');
const botService = require('../services/bot.service');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join_game', async ({ username, userId }) => {
      const user = { id: userId, username };
      const game = await gameService.matchPlayer(user);

      socket.join(game.id);
      io.to(game.id).emit('game_start', game);
    });

    socket.on('make_move', async ({ gameId, column }) => {
      const result = await gameService.makeMove(gameId, column, false);
      io.to(gameId).emit('update_board', result);

      if (result.vsBot && !result.winner) {
        const botCol = await botService.getBotMove(result.board);
        const botResult = await gameService.makeMove(gameId, botCol, true);
        io.to(gameId).emit('update_board', botResult);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};
