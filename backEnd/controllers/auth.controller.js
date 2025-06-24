const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
require('dotenv').config();

exports.register = async (req, res, next) => {
  try {
    const { username,userId } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });
    console.log('Registering user:', username);
    console.log("the req.body is:", req.body);

    const user = await UserModel.registerUser(userId,username);
    console.log('User registered:', user);
    const token = jwt.sign({ id: userId, username: username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });

    const user = await UserModel.findUserByUsername(username);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};
