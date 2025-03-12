import { kafka, KAFKA_TOPIC, registry } from "../../kafka/src/kafka-config";

const producer = kafka.producer();

export async function sendMessageToKafka(message: any) {
  await producer.connect();

  const schema = {
    type: 'record' as const,
    name: 'GenerationRequest',
    namespace: 'com.example',
    fields: [
      { name: 'id', type: 'string' },
      { name: 'userId', type: 'string' },
      { name: 'prompt', type: 'string' }
    ]
  };

  const { id: schemaId } = await registry.register(schema);
  const encodedMessage = await registry.encode(schemaId, message);

  await producer.send({
    topic: KAFKA_TOPIC,
    messages: [{ value: encodedMessage }],
  });

  console.log(`Mensagem enviada para Kafka:`, message);
}
