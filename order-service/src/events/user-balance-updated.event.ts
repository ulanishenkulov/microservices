export type UserBalanceUpdatedEvent = {
  eventId: string,
  userId: string,
  orderId: string,
  previousBalance: number,
  newBalance: number,
  timestamp: string
};