export type BalanceUpdatedEvent = {
  eventId: string,
  userId: string,
  orderId: string,
  previousBalance: number,
  newBalance: number,
  timestamp: string
};
