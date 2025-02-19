import { Injectable } from '@nestjs/common';
import { ModerationRequestDto } from './dto/moderation-request.dto';

@Injectable()
export class ModerationService {
  getHello(): string {
    return 'Hello, World!';
  }

  validatePrompt(request: ModerationRequestDto): {
    isApproved: boolean;
    message: string;
  } {
    const prohibitedWords = [
      'naked',
      'nudity',
      'gore',
      'violence',
      'dead body',
    ];

    const containsProhibitedWords = prohibitedWords.some((word) =>
      request.prompt.toLowerCase().includes(word),
    );

    if (containsProhibitedWords) {
      return {
        isApproved: false,
        message: 'Your prompt contains prohibited words and has been rejected.',
      };
    }

    return {
      isApproved: true,
      message: 'Your prompt has been approved.',
    };
  }
}
