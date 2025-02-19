import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidatorService {
  getHello(): string {
    return 'Hello World!';
  }
}
