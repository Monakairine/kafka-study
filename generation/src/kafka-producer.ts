import { kafka, KAFKA_TOPIC, registry } from "../../kafka/src/kafka-config";

const producer = kafka.producer();

export async function sendMessageToKafka(message: any) {
  await producer.connect();

  await producer.send({
    topic: KAFKA_TOPIC,
    messages: [{ value: JSON.stringify(message) }],
  });

  console.log(`Mensagem enviada para Kafka:`, message);
}
