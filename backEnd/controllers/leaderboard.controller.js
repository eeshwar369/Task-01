const leaderboardService = require('../services/leaderboard.service');

exports.getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await leaderboardService.fetchLeaderboard();
    res.json(leaderboard);
  } catch (err) {
    next(err);
  }
};
