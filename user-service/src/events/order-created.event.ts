import { EventType } from "src/types/payment.enums"

export type OrderCreatedEvent = {
  eventId: string,           // UUID для idempotency
  orderId: string,
  userId: string,
  type: EventType,
  productId?: string,
  amount: number,
  price: number,
  finalSum: number,
  timestamp: string
}