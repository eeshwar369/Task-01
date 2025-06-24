const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require('dotenv').config();

const authRoutes = require("./routes/auth.routes");
const gameRoutes = require("./routes/game.routes");
const leaderboardRoutes = require("./routes/leaderboard.routes");
const errorHandler = require("./middlewares/error.middleware");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests, please try again later."
}); 

app.use(limiter);

// API Routes
app.use('/',userRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Global Error Handler
app.use(errorHandler);


module.exports = app;