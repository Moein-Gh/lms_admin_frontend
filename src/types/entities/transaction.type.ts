import { BadgeVariant } from "@/components/ui/badge";
import { TransactionImage } from "./transaction-image.type";
import type { User } from "./user.type";

export enum TransactionKind {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  LOAN_DISBURSEMENT = "LOAN_DISBURSEMENT",
  TRANSFER = "TRANSFER"
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
  [TransactionKind.LOAN_DISBURSEMENT]: { label: "پرداخت وام", variant: "secondary" },
  [TransactionKind.TRANSFER]: { label: "انتقال", variant: "warning" }
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
