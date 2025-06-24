const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const app = require('./app');
const socketHandler = require('./sockets/socketHandler');
const { initKafka } = require('./kafka/producer');

// Load environment variables
dotenv.config();

// Create HTTP server and wrap with socket.io
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*', // You can restrict this in production
    methods: ['GET', 'POST']
  }
});

// Initialize WebSocket handling
socketHandler(io);

// Initialize Kafka producer
initKafka();


const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the Connect Four API!');
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});




