import { PaymentType } from "src/payments/enums/payment.enums"

export type OrderCreatedEvent = {
  eventId: string,           // UUID для idempotency
  orderId: string,
  userId: string,
  type: PaymentType,
  productId?: string,
  amount: number,
  price: number,
  finalSum: number,
  timestamp: string
}