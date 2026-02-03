import { EventType } from "src/types/payment.enums";

export type PaymentsCompletedEvent = {
  eventId: string,
  userId: string,
  paymentId: string,
  orderId: string
  amount: number,
  type: EventType
  timestamp: string
};
