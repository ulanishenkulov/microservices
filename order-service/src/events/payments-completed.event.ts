import { OrderType } from "src/orders/enums/order.enums";

export type PaymentsCompletedEvent = {
  eventId: string,
  userId: string,
  orderId: string,
  paymentId: string,
  amount: number,
  type: OrderType
  timestamp: string
};
