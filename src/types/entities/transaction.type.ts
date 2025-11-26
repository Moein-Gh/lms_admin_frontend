import type { User } from "./user.type";

export enum TransactionKind {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  LOAN_DISBURSEMENT = "LOAN_DISBURSEMENT",
  LOAN_REPAYMENT = "LOAN_REPAYMENT",
  SUBSCRIPTION_PAYMENT = "SUBSCRIPTION_PAYMENT",
  FEE = "FEE"
}

export enum TransactionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  ALLOCATED = "ALLOCATED"
}

export interface Transaction {
  readonly id: string;
  readonly code: number;
  readonly kind: TransactionKind;
  readonly amount: string;
  readonly status: TransactionStatus;
  readonly externalRef?: string | null;
  readonly note?: string | null;
  readonly userId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  // Relations
  readonly user?: User;
  readonly images: TransactionImage[];
}

export interface TransactionImage {
  readonly id: string;
  readonly url: string;
  readonly transactionId: string;
}
