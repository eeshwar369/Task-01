const kafka = require('../config/kafka');
let producer;

exports.initKafka = async () => {
  producer = kafka.producer();
  await producer.connect();
  console.log('Kafka producer connected');
};

exports.publishGameEvent = async (event) => {
  if (!producer) return;

  await producer.send({
    topic: 'game-events',
    messages: [{ value: JSON.stringify(event) }],
  });

  console.log('Event published:', event);
};
