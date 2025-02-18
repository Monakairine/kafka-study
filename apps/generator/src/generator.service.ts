import { Injectable } from '@nestjs/common';

@Injectable()
export class GeneratorService {
  getHello(): string {
    return 'Hello World!';
  }
}
