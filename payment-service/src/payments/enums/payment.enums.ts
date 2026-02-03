export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PAID = 'paid',
  FAILED = 'failed',
}

export enum PaymentType {
  TOPUP = 'topup',
  WITHDRAW = 'withdraw',
  PRODUCT = 'product',
}