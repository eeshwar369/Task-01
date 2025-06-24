const db = require('../config/db');

exports.createGame = async (p1, p2) => {
  const [result] = await db.query(
    'INSERT INTO games (player1_id, player2_id) VALUES (?, ?)',
    [p1, p2]
  );
  return { id: result.insertId, player1: p1, player2: p2 };
};

exports.completeGame = async (gameId, winnerId) => {
  await db.query(
    'UPDATE games SET winner_id = ? WHERE id = ?',
    [winnerId, gameId]
  );
};

exports.getGame = async (gameId) => {
  const [rows] = await db.query(
    'SELECT * FROM games WHERE id = ?',
    [gameId]
  );
  return rows[0];
};
