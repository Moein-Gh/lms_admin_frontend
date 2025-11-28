import { BadgeVariant } from "@/components/ui/badge";
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

export const TRANSACTION_KIND_META: Record<
  TransactionKind,
  { readonly label: string; readonly variant: BadgeVariant }
> = {
  [TransactionKind.DEPOSIT]: { label: "واریز", variant: "active" },
  [TransactionKind.WITHDRAWAL]: { label: "برداشت", variant: "inactive" },
  [TransactionKind.LOAN_DISBURSEMENT]: { label: "پرداخت وام", variant: "warning" },
  [TransactionKind.LOAN_REPAYMENT]: { label: "بازپرداخت وام", variant: "active" },
  [TransactionKind.SUBSCRIPTION_PAYMENT]: { label: "پرداخت اشتراک", variant: "outline" },
  [TransactionKind.FEE]: { label: "کارمزد", variant: "inactive" }
};

/**
 * Persian labels + badge variants for transaction statuses.
 */
export const TRANSACTION_STATUS_BADGE: Record<
  TransactionStatus,
  { readonly label: string; readonly variant: BadgeVariant }
> = {
  [TransactionStatus.APPROVED]: { label: "تایید شده", variant: "active" },
  [TransactionStatus.PENDING]: { label: "در انتظار", variant: "outline" },
  [TransactionStatus.REJECTED]: { label: "رد شده", variant: "inactive" },
  [TransactionStatus.ALLOCATED]: { label: "اختصاص یافته", variant: "outline" }
};

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
