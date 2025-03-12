"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KAFKA_TOPIC = exports.registry = exports.kafka = void 0;
var kafkajs_1 = require("kafkajs");
var confluent_schema_registry_1 = require("@kafkajs/confluent-schema-registry");
exports.kafka = new kafkajs_1.Kafka({
    clientId: 'kafka-microservices',
    brokers: ['localhost:9094'],
});
exports.registry = new confluent_schema_registry_1.SchemaRegistry({
    host: 'http://localhost:8081',
});
exports.KAFKA_TOPIC = 'generation-request';
//# sourceMappingURL=kafka-config.js.map