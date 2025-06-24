const gameService = require('../services/game.service');
const botService = require('../services/bot.service');

exports.startMatch = async (req, res, next) => {
  try {
    const user = { id: req.user.id, username: req.user.username };
    const game = await gameService.matchPlayer(user);
    res.json(game);
  } catch (err) {
    next(err);
  }
};

exports.makeMove = async (req, res, next) => {
  try {
    const { gameId, column } = req.body;
    const result = await gameService.makeMove(gameId, column);

    if (result?.vsBot && !result?.winner) {
      // Let bot respond if still playing
      const botCol = await botService.getBotMove(result.board);
      const botMove = await gameService.makeMove(gameId, botCol, true);
      return res.json({ ...botMove, botPlayed: botCol });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getGameState = async (req, res, next) => {
  try {
    const gameId = req.params.gameId;
    const game = await gameService.getGame(gameId);
    res.json(game);
  } catch (err) {
    next(err);
  }
};
