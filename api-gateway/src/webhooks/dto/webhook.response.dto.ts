import { ApiProperty } from '@nestjs/swagger';

export class WebhookResponseDto {
  @ApiProperty({ example: true, description: 'Webhook received acknowledgement' })
  received: boolean;
}
