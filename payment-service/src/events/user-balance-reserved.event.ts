import { PaymentType } from "src/payments/enums/payment.enums";

export type UserBalanceReservedEvent = {
  eventId: string,
  orderId: string,
  userId: string,
  amount: number,
  type: PaymentType
  timestamp: string
};
