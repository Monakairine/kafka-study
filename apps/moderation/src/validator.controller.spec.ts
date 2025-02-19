import { Test, TestingModule } from '@nestjs/testing';
import { ValidatorController } from './validator.controller';
import { ValidatorService } from './validator.service';

describe('ValidatorController', () => {
  let validatorController: ValidatorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ValidatorController],
      providers: [ValidatorService],
    }).compile();

    validatorController = app.get<ValidatorController>(ValidatorController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(validatorController.getHello()).toBe('Hello World!');
    });
  });
});
