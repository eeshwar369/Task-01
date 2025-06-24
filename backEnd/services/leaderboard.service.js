const db = require('../config/db');

exports.fetchLeaderboard = async () => {
  const [rows] = await db.query(`
    SELECT u.username, l.wins
    FROM leaderboard l
    JOIN users u ON u.id = l.user_id
    ORDER BY l.wins DESC
    LIMIT 10
  `);

  return rows;
};
