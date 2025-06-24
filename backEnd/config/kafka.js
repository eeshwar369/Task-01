const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'connect-four-service',
  brokers: [process.env.KAFKA_BROKER], // e.g., "localhost:9092"
});

module.exports = kafka;
