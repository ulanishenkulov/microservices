export type InsufficientEvent = {
  eventId: string,
  userId: string,
  orderId: string,
  requiredAmount: number,
  currentBalance: number,
  timestamp: string
};