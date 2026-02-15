import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentType } from 'src/enums/payment.enums';

export class UpdatePaymentDto {
  @ApiProperty({
    description: 'ID of the payment to update',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  paymentId: string;

  @ApiProperty({
    description: 'Type of payment event from Stripe',
    enum: PaymentType,
    example: PaymentType.TOPUP,
  })
  @IsNotEmpty()
  type: PaymentType;
}
