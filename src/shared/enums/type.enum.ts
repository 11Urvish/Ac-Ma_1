export enum UserTypeEnum {
  SUPER_ADMIN = 'super_admin',
  USER = 'user'
}

export enum TransactionTypeEnum {
  CREDIT = 1,
  DEBIT = 2,
}

export enum PaymentTypeEnum {
  PART_PAYMENT = 'part_payment',
  INTEREST_PAYMENT = 'interest_payment',
  FULL_PAYMENT = 'full_payment',
}

export enum UPITypeEnum {
  G_PAY = 1,
  PAYTM = 2,
  PHONE_PAY = 3
}

export enum ErrorTypeEnum {
  CONFLICT = 'CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE'
}