import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ModerationModule } from './moderation.module';

async function bootstrap() {
  const app = await NestFactory.create(ModerationModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Moderation API')
    .setDescription('API for moderating prompts for image generation')
    .setVersion('1.0')
    .addTag('Moderation')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Moderation service is running at: http://localhost:3000/api`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
