# Kafka Study

A small demo project for learning **Apache Kafka** with a microservices-style flow: an HTTP API produces messages to Kafka, and NestJS services are set up to consume them.

## Architecture

- **Generation service** (Express) — Accepts `POST /generate`, publishes to Kafka topic `generation-request`.
- **Kafka** — Broker + Schema Registry + Kafka UI + REST Proxy (Docker).
- **Moderation service** (NestJS) — Kafka consumer (group: `moderation-group`); scaffold only.
- **Generation-complete service** (NestJS) — Placeholder for a second consumer.

## Prerequisites

- **Node.js** (v18+)
- **Docker** and **Docker Compose**
- **npm** (or yarn)

## Quick start

### 1. Start Kafka (required first)

From the repo root:

```bash
cd kafka
docker-compose up -d
```

Wait until Kafka is healthy (about 30 seconds). Optional: open [Kafka UI](http://localhost:8080) to inspect topics and messages.

**Ports:**

| Service          | Port | Description        |
|------------------|------|--------------------|
| Kafka (broker)   | 9094 | Client connections |
| Schema Registry  | 8081 | Schemas            |
| Kafka REST Proxy | 8082 | REST API           |
| Kafka UI         | 8080 | Web UI             |

### 2. Install dependencies

From the repo root, install for each service:

```bash
# Generation service (producer)
cd services/generation && npm install && cd ../..

# Moderation service (consumer)
cd services/moderation && npm install && cd ../..
```

### 3. Run the generation service (producer)

```bash
cd services/generation
npm run start
```

You should see: `Generation service running on port 3001`.

### 4. Run the moderation service (consumer)

In a **second terminal**:

```bash
cd services/moderation
npm run start
```

For development with watch mode:

```bash
npm run start:dev
```

### 5. Send a request

In another terminal (or with curl from anywhere):

```bash
curl -X POST http://localhost:3001/generate \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "prompt": "flower"}'
```

Expected response:

```json
{"message":"Request sent to Kafka","requestId":"..."}
```

The message is published to the `generation-request` topic. You can confirm in Kafka UI at http://localhost:8080.

## Project layout

```
kafka-study/
├── kafka/                    # Docker Compose: Kafka + Schema Registry + UI + REST Proxy
│   ├── docker-compose.yml
│   └── src/                  # Kafka config and schema registry usage
├── services/
│   ├── generation/           # Express app — POST /generate → Kafka
│   ├── moderation/           # NestJS Kafka consumer (moderation-group)
│   └── generation_complete/  # NestJS placeholder consumer
└── README.md
```

## Troubleshooting

### Kafka image not found


The stack now uses the official **Apache Kafka** image (`apache/kafka:latest`). If you need a specific version: `KAFKA_IMAGE=apache/kafka:4.0.1 docker-compose up -d`. See [Apache Kafka Docker tags](https://hub.docker.com/r/apache/kafka/tags).

If you see "container name /kafka already in use", run `docker-compose down` then `docker rm -f kafka` and try again.

### Generation service can’t connect to Kafka

- Ensure Kafka is running: `docker ps` and check the `kafka` container.
- Clients use **port 9094** (EXTERNAL listener). Confirm in `kafka/src/kafka-config.ts` that `brokers` is `['localhost:9094']`.

### Moderation service not receiving messages

The moderation app is configured as a Kafka consumer but the consumer logic in `AppService` is still a stub. Messages will be produced to the topic; implementing the actual handler is the next step.

## Stopping

```bash
cd kafka
docker-compose down
```

Stop the Node services with `Ctrl+C` in their terminals.
