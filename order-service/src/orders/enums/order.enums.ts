export enum OrderType {
  TOPUP = 'topup',
  WITHDRAW = 'withdraw',
  PRODUCT = 'product',
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}