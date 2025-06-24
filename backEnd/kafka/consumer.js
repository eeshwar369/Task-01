const kafka = require('../config/kafka');
const db = require('../config/db');

const consumer = kafka.consumer({ groupId: 'analytics-group' });

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'game-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      const { type, player, players, winner } = event;

      if (type === 'game_over' && winner) {
        await db.query(
          'INSERT INTO game_events (event_type, username) VALUES (?, ?)',
          [type, winner]
        );
        await db.query(
          'INSERT INTO leaderboard (user_id, wins) VALUES (?, 1) ON DUPLICATE KEY UPDATE wins = wins + 1',
          [winner]
        );
      } else if (type === 'match_found' || type === 'bot_match') {
        const usernames = players || [player];
        for (const username of usernames) {
          await db.query(
            'INSERT INTO game_events (event_type, username) VALUES (?, ?)',
            [type, username]
          );
        }
      }

      console.log('Processed event:', event);
    },
  });
}

run().catch(console.error);

module.exports = consumer;
