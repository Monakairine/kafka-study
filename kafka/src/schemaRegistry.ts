import { Kafka } from 'kafkajs';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';

// Initialize Kafka client
const kafka = new Kafka({
  clientId: 'schema-registry-demo',
  brokers: ['localhost:9094']
});

// Initialize Schema Registry client
const registry = new SchemaRegistry({
  host: 'http://localhost:8081'
});


// Define Avro schema
const schema = {
  type: 'record' as const,
  name: 'ExampleRecord',
  namespace: 'com.example',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'timestamp', type: 'long' },
    { name: 'data', type: 'string' }
  ]
};

const KAFKA_TOPIC = 'schema-validated-topic';


async function produceToKafka(producer: any, schemaId: number, message: any): Promise<void> {
  const encodedMessage = await registry.encode(schemaId, message);
  await producer.send({ topic: KAFKA_TOPIC, messages: [{ value: encodedMessage }] });
  console.log('Message sent to Kafka');
}


async function consumeFromKafka(consumer: any, callback: (msg: any) => void): Promise<void> {
  await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }: { message: { value: Buffer } }) => {
      const decodedMessage = await registry.decode(message.value);
      callback(decodedMessage);
    }
  });
}


async function main(): Promise<void> {
  try {
    const { id: schemaId } = await registry.register(schema);
    console.log('Schema registered with id:', schemaId);
    const producer = kafka.producer();
    const consumer = kafka.consumer({ groupId: 'test-group' });
    await producer.connect();
    await consumer.connect();
    const message = { id: '123', timestamp: Date.now(), data: 'Hello, Schema Registry!' };
    await produceToKafka(producer, schemaId, message);
    await consumeFromKafka(consumer, (msg) => console.log('Received from Kafka:', msg));
  } catch (error) {
    console.error('Error:', error);
  }
}

process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  process.exit(0);
});

main().catch(console.error);
