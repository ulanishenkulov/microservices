import { PaymentType } from "src/payments/enums/payment.enums"

export type markPaidTypeForService = {
    id: string,
    type: PaymentType
}