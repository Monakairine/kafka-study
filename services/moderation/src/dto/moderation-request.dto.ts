import { ApiProperty } from '@nestjs/swagger';

export class ModerationRequestDto {
  @ApiProperty()
  prompt!: string;

  @ApiProperty({ example: 'user-123' })
  userId: string | undefined;
}
