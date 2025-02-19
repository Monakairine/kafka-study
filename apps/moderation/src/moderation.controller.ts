import { Body, Controller, Get, Post } from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { ModerationRequestDto } from './dto/moderation-request.dto';

@Controller()
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Get()
  getHello(): string {
    return this.moderationService.getHello();
  }

  @Post('/validate-prompt')
  validatePrompt(@Body() request: ModerationRequestDto): {
    isApproved: boolean;
    message: string;
  } {
    return this.moderationService.validatePrompt(request);
  }
}
