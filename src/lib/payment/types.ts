import { PaymentMethod, PaymentStatus } from '../../types'

export interface CreatePaymentParams {
  orderId: string
  orderNumber: string
  grossAmount: number
  customerDetails: {
    fullName: string
    phone: string
    address: string
  }
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
}

export interface PaymentTransactionResult {
  success: boolean
  paymentMethod: PaymentMethod
  status: PaymentStatus
  gatewayReference: string
  qrString?: string
  qrUrl?: string
  expiryTime?: string
  message: string
  isSandbox: boolean
  providerName: string
}

export interface PaymentStatusCheckResult {
  orderId: string
  status: PaymentStatus
  isPaid: boolean
  transactionTime?: string
  settlementTime?: string
  rawStatus?: string
  message: string
}
