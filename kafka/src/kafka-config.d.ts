import { Kafka } from 'kafkajs';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
export declare const kafka: Kafka;
export declare const registry: SchemaRegistry;
export declare const KAFKA_TOPIC = "generation-request";
