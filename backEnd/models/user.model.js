const db = require('../config/db');

exports.registerUser = async (id, username) => {
  await db.query(
    'INSERT IGNORE INTO users (id, username) VALUES (?, ?)',
    [id, username]
  );
};

exports.getUser = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};
