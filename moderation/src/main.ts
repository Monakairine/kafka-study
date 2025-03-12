import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configura Kafka para consumir mensagens
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9094'],
      },
      consumer: {
        groupId: 'moderation-group',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
  console.log('Moderation service is listening for Kafka messages...');
}

bootstrap().catch((error) => {
  console.error('❌ Error during bootstrap:', error);
  process.exit(1);
});
