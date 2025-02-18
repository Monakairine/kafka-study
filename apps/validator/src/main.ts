import { NestFactory } from '@nestjs/core';
import { ValidatorModule } from './validator.module';

async function bootstrap() {
  const app = await NestFactory.create(ValidatorModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
