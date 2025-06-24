const UserModel = require('../models/user.model');

exports.registerUser = async (req, res) => {
  const { username, userId } = req.body;
  if (!username || !userId) {
    return res.status(400).json({ error: 'Missing username or ID' });
  }

  try {
    await UserModel.registerUser(userId, username);
    const user = await UserModel.getUser(userId);
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    console.error('User registration failed:', err);
    res.status(500).json({ error: 'User registration failed' });
  }
};
