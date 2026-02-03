import { OrderType } from "src/orders/enums/order.enums"

export type OrderCreatedEvent = {
  eventId: string,           // UUID для idempotency
  orderId: string,
  userId: string,
  type: OrderType,
  productId?: string,
  amount: number,
  price: number,
  finalSum: number,
  timestamp: string
}