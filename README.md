# 🎮 4 in a Row - Real-Time Multiplayer Game

This project implements a real-time, multiplayer version of **Connect Four** (4 in a Row) using:

- ⚙️ Node.js + Express (Backend)
- 🌐 Angular (Frontend)
- 🧠 Competitive Bot (AI opponent)
- 📡 WebSockets (Socket.IO) for real-time communication
- 🐘 MySQL for persistent storage
- 📊 Kafka for analytics

---

## 🚀 Features

- 🔵 Real-time 1v1 matchmaking (player vs player or vs bot if none found in 10s)
- 🤖 Strategic bot that blocks or wins
- 💬 WebSocket-based gameplay
- 📈 Kafka events for analytics (average duration, most frequent winners, etc.)
- 🧠 In-memory game state with reconnection support
- 🏆 Leaderboard with total wins per user

---

## 🧱 Project Structure

