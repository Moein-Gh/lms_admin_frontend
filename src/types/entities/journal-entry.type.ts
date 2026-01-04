import type { Account } from "./account.type";
import type { Installment } from "./installment.type";
import type { Journal } from "./journal.type";
import type { LedgerAccount } from "./ledger-account.type";
import type { Loan } from "./loan.type";
import type { SubscriptionFee } from "./subscription-fee.type";

export enum DebitCredit {
  DEBIT = "DEBIT",
  CREDIT = "CREDIT"
}

export enum JournalEntryTarget {
  INSTALLMENT = "INSTALLMENT",
  LOAN = "LOAN",
  SUBSCRIPTION_FEE = "SUBSCRIPTION_FEE",
  ACCOUNT = "ACCOUNT"
}

export enum AllocationType {
  ACCOUNT_BALANCE = "ACCOUNT_BALANCE",
  LOAN_REPAYMENT = "LOAN_REPAYMENT",
  SUBSCRIPTION_FEE = "SUBSCRIPTION_FEE"
}

export const DEBIT_CREDIT_META = {
  [DebitCredit.DEBIT]: { label: "بدهکار", variant: "active" },
  [DebitCredit.CREDIT]: { label: "بستانکار", variant: "outline" }
} as const;

export const JOURNAL_ENTRY_TARGET_META = {
  [JournalEntryTarget.INSTALLMENT]: { label: "قسط", variant: "outline" },
  [JournalEntryTarget.LOAN]: { label: "وام", variant: "active" },
  [JournalEntryTarget.SUBSCRIPTION_FEE]: { label: "ماهیانه", variant: "inactive" },
  [JournalEntryTarget.ACCOUNT]: { label: "حساب", variant: "outline" }
} as const;

export const ALLOCATION_TYPE_META = {
  [AllocationType.ACCOUNT_BALANCE]: { label: "تخصیص از موجودی حساب", variant: "active" },
  [AllocationType.LOAN_REPAYMENT]: { label: "تخصیص برای بازپرداخت وام", variant: "active" },
  [AllocationType.SUBSCRIPTION_FEE]: { label: "تخصیص برای ماهیانه", variant: "outline" }
} as const;

export interface JournalEntry {
  id: string;
  code: number;
  journalId: string;
  ledgerAccountId: string;
  dc: DebitCredit;
  amount: string;
  targetType?: JournalEntryTarget;
  targetId?: string;
  target?: Account | Loan | SubscriptionFee | Installment;
  removable: boolean;
  createdAt: Date;
  journal?: Journal;
  ledgerAccount?: Partial<LedgerAccount>;
}
