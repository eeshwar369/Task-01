const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');
const authMiddleware = require('../middlewares/auth.middleware');
router.post('/match', authMiddleware, gameController.startMatch);
router.post('/move', authMiddleware, gameController.makeMove);
router.get('/:gameId', authMiddleware, gameController.getGameState);

module.exports = router;
