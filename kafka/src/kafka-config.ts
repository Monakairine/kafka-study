import { Kafka } from 'kafkajs';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';

export const kafka = new Kafka({
  clientId: 'kafka-microservices',
  brokers: ['localhost:9094'],
});

export const registry = new SchemaRegistry({
  host: 'http://localhost:8081',
});

export const KAFKA_TOPIC = 'generation-request';
