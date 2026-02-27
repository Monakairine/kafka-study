# Kafka Study

A small demo project for learning **Apache Kafka** with a microservices-style flow: an HTTP API produces messages to Kafka, and NestJS services are set up to consume them.

## Architecture

- **Generation service** (Express) — Accepts `POST /generate`, publishes to Kafka topic `generation-request`.
- **Kafka** — Broker + Schema Registry + Kafka UI + REST Proxy (Docker).
- **Moderation service** (NestJS) — Kafka consumer (group: `moderation-group`).
- **Analytics service** (NestJS) — Kafka consumer (group: `analytics-group`); logs generation events and can forward them to an endpoint (e.g. Segment, Mixpanel).
- **Generation-complete service** (NestJS) — Placeholder for a second consumer.

## Kafka concepts: broker, topic, consumer, schema registry

### Broker

A **broker** is the Kafka server that stores and serves data. It receives messages from **producers**, stores them in **topics**, and delivers them to **consumers**. In this project you run one broker in Docker (`kafka` container). In production you usually run several brokers (a cluster) for fault tolerance and scale. Clients connect to the broker using the address you configure (here: `localhost:9094`).

### Topic

A **topic** is a named log (stream) of messages. Producers write to a topic; consumers read from it. Each topic is split into one or more **partitions** (for parallelism and order per partition). In this project there is one topic: `generation-request`. Messages stay in the topic until **retention** deletes them; they are not removed when a consumer reads them.

### Consumer

A **consumer** is an application (or process) that reads messages from one or more topics. It belongs to a **consumer group**. Each group has its own **offset** (position) per partition, so the same message can be read by different groups (e.g. moderation and analytics) while each group processes it once and moves forward. In this project, the **moderation** and **analytics** services are consumers (different groups) on the topic `generation-request`.

### Schema Registry

The **Schema Registry** is a separate service (not part of core Kafka). It stores **schemas** (e.g. Avro, JSON Schema) for the data in your topics. Producers and consumers can use it to serialize/deserialize messages in a consistent way and evolve schemas over time. In this project it runs in Docker (port 8081); the generation/moderaton/analytics services currently send plain JSON, so they don’t use it yet, but it’s there if you want to add schema-based messages later.

### How they fit together

```
                  PRODUCER
              (Your Service)
                     │
                     │  sends event
                     ▼
            ┌──────────────────┐
            │      BROKER      │
            │     (Kafka)      │
            └────────┬─────────┘
                     │
                     │ stores messages in
                     ▼
            ┌──────────────────┐
            │       TOPIC      │
            │ generation-req   │
            │  (partitioned)   │
            └────────┬─────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌────────────────┐      ┌────────────────┐
│   CONSUMER     │      │   CONSUMER     │
│  moderation    │      │   analytics    │
│   (group A)    │      │   (group B)    │
└────────────────┘      └────────────────┘

Optional (advanced):

            ┌──────────────────┐
            │ Schema Registry  │
            │ (message format) │
            └──────────────────┘
```

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

# Analytics service (consumer)
cd services/analytics && npm install && cd ../..
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

For development with watch mode: `npm run start:dev`.

### 5. (Optional) Run the analytics service

In a **third terminal**, to log generation events and optionally send them to an external analytics endpoint:

```bash
cd services/analytics
npm run start
```

To forward events to an API (e.g. Segment, Mixpanel, or your own), set the endpoint before starting:

```bash
ANALYTICS_ENDPOINT=https://api.segment.io/v1/track npm run start
```

### 6. Send a request

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

The message is published to the `generation-request` topic. **Moderation** and **analytics** (if running) will each receive the same event; you can confirm in Kafka UI at http://localhost:8080.

## Project layout

```
kafka-study/
├── kafka/                    # Docker Compose: Kafka + Schema Registry + UI + REST Proxy
│   ├── docker-compose.yml
│   └── src/                  # Kafka config and schema registry usage
├── services/
│   ├── generation/           # Express app — POST /generate → Kafka
│   ├── moderation/           # NestJS Kafka consumer (moderation-group)
│   ├── analytics/            # NestJS Kafka consumer (analytics-group); emits analytics events
│   └── generation_complete/  # NestJS placeholder consumer
└── README.md
```

## Flow: how messages move and when they’re “done”

### 1. From request to the topic

1. Client calls `POST /generate` → **Generation service** publishes a message to the topic `generation-request`.
2. The message is **appended to the topic** (Kafka treats the topic as a **log**, not a classic queue).
3. The message **stays in the topic** until **retention** removes it (e.g. by time or size; often ~7 days by default). It is **not** removed when a consumer reads it.

### 2. Multiple consumers, same message

- **Moderation** and **Analytics** use **different consumer groups** (`moderation-group`, `analytics-group`).
- Each consumer group has its **own offset** (position) per partition. So both groups can read the **same** message from the topic; each group processes it **once** and then moves its offset forward.
- So: one message → moderation processes it once, analytics processes it once. The message remains on the broker until retention deletes it, but **each group does not get the same message again** because their offsets have moved past it.

### 3. When does the message disappear?

- When the broker’s **retention** policy runs (time-based or size-based). After that, the data is deleted and no consumer can read it again.
- It does **not** stay in the topic forever unless you configure retention that way.

### 4. When could the same message be processed more than once?

- **Same consumer group:** Normally no — the group commits its offset after processing, so the next fetch returns only newer messages.
- Duplicates can happen if: the consumer **doesn’t commit** the offset (e.g. crash before commit), someone **resets the offset** for replay, or there’s a bug (e.g. processing without committing).

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
