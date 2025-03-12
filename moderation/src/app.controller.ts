import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { registry } from '../../kafka/src/kafka-config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger = new Logger(AppController.name),
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('generation-request')
  async handleKafkaMessage(@Payload() message: { value: Buffer }) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const decodedMessage = await registry.decode(message.value);
      this.logger.log(
        `📩 Mensagem recebida: ${JSON.stringify(decodedMessage)}`,
      );
    } catch (error) {
      this.logger.error(`❌ Erro ao decodificar mensagem: ${error}`);
    }
  }
}
