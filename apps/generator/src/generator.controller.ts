import { Controller, Get } from '@nestjs/common';
import { GeneratorService } from './generator.service';

@Controller()
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Get()
  getHello(): string {
    return this.generatorService.getHello();
  }
}
