import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9094'],
      },
      consumer: {
        groupId: 'analytics-group',
        sessionTimeout: 30000,
        rebalanceTimeout: 60000,
        heartbeatInterval: 3000,
      },
    },
  });

  await app.startAllMicroservices();
  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`Analytics service is listening for Kafka messages (HTTP on port ${port})...`);
}

bootstrap().catch((error) => {
  console.error('❌ Error during bootstrap:', error);
  process.exit(1);
});
