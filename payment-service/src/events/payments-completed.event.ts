import { PaymentType } from "src/payments/enums/payment.enums";

export type PaymentsCompletedEvent = {
  eventId: string,
  userId: string,
  orderId: string,
  paymentId: string,
  amount: number,
  type: PaymentType
  timestamp: string
};
