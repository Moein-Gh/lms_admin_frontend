import { Account } from "./account.type";
import { JournalEntry } from "./journal-entry.type";

export enum SubscriptionFeeStatus {
  DUE = "DUE",
  PAID = "PAID",
  ALLOCATED = "ALLOCATED"
}

export const SUBSCRIPTION_FEE_STATUS_LABEL: Record<SubscriptionFeeStatus, string> = {
  [SubscriptionFeeStatus.DUE]: "در انتظار پرداخت",
  [SubscriptionFeeStatus.PAID]: "پرداخت شده",
  [SubscriptionFeeStatus.ALLOCATED]: "تخصیص یافته"
};

export type SubscriptionFee = {
  readonly id: string;
  readonly code: number;
  readonly accountId: string;
  readonly journalEntryId?: string;
  readonly periodStart: Date;
  readonly amount: string;
  readonly status: SubscriptionFeeStatus;
  readonly dueDate?: Date;
  readonly paidAt?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  // Relations
  readonly account?: Account;
  readonly journalEntry?: JournalEntry;
};
