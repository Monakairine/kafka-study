import { ApiProperty } from '@nestjs/swagger';

export class ModerationRequestDto {
  @ApiProperty({ example: 'flower' })
  prompt: string;

  @ApiProperty({ example: 'user-123' })
  userId: string;
}
