import { Controller, Get } from '@nestjs/common';
import { ValidatorService } from './validator.service';

@Controller()
export class ValidatorController {
  constructor(private readonly validatorService: ValidatorService) {}

  @Get()
  getHello(): string {
    return this.validatorService.getHello();
  }
}
