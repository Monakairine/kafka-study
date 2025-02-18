import { Test, TestingModule } from '@nestjs/testing';
import { GeneratorController } from './generator.controller';
import { GeneratorService } from './generator.service';

describe('GeneratorController', () => {
  let generatorController: GeneratorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GeneratorController],
      providers: [GeneratorService],
    }).compile();

    generatorController = app.get<GeneratorController>(GeneratorController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(generatorController.getHello()).toBe('Hello World!');
    });
  });
});
