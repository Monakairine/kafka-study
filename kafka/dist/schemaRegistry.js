"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const confluent_schema_registry_1 = require("@kafkajs/confluent-schema-registry"); //valida as mensagens do kafka
// Initialize Kafka client
const kafka = new kafkajs_1.Kafka({
    clientId: 'schema-registry-demo',
    brokers: ['localhost:9094']
});
//O broker no Kafka é um servidor que recebe, 
//armazena e distribui mensagens para os consumidores. 
//Ele é o coração do Apache Kafka, funcionando como um intermediário entre produtores 
//(quem envia mensagens) e consumidores (quem recebe mensagens).
// Initialize Schema Registry client
const registry = new confluent_schema_registry_1.SchemaRegistry({
    host: 'http://localhost:8081'
});
// Define Avro schema
const schema = {
    type: 'record',
    name: 'ExampleRecord',
    namespace: 'com.example',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'timestamp', type: 'long' },
        { name: 'data', type: 'string' }
    ]
};
const KAFKA_TOPIC = 'schema-validated-topic';
function produceToKafka(producer, schemaId, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const encodedMessage = yield registry.encode(schemaId, message);
        yield producer.send({ topic: KAFKA_TOPIC, messages: [{ value: encodedMessage }] });
        console.log('Message sent to Kafka');
    });
}
function consumeFromKafka(consumer, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        yield consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true });
        yield consumer.run({
            eachMessage: ({ message }) => __awaiter(this, void 0, void 0, function* () {
                const decodedMessage = yield registry.decode(message.value);
                callback(decodedMessage);
            })
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id: schemaId } = yield registry.register(schema);
            console.log('Schema registered with id:', schemaId);
            const producer = kafka.producer();
            const consumer = kafka.consumer({ groupId: 'test-group' });
            yield producer.connect();
            yield consumer.connect();
            const message = { id: '123', timestamp: Date.now(), data: 'Hello, Schema Registry!' };
            yield produceToKafka(producer, schemaId, message);
            yield consumeFromKafka(consumer, (msg) => console.log('Received from Kafka:', msg));
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Shutting down...');
    process.exit(0);
}));
main().catch(console.error);
