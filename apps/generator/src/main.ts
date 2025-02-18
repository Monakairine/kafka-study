import { NestFactory } from '@nestjs/core';
import { GeneratorModule } from './generator.module';

async function bootstrap() {
  const app = await NestFactory.create(GeneratorModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
