import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty({
    description: 'Redirect URL to payment provider',
    example: 'https://checkout.stripe.com/pay/cs_test_123',
  })
  url: string;
}
