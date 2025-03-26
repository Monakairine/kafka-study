import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('generation-request')
  handleKafkaMessage(@Payload() message: any) {
    try {
      console.log(`📨 Mensagem recebida: ${JSON.stringify(message)}`);
      // a propria lib do microservice ja faz o decode da mensagem
    } catch (error) {
      console.log(`❌ Erro ao decodificar mensagem: ${error}`);
    }
  }
}
