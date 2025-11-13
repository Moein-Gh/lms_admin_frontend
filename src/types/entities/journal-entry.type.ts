import type { Journal } from "./journal.type";
import type { LedgerAccount } from "./ledger-account.type";

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

export interface JournalEntry {
  id: string;
  code: number;
  journalId: string;
  ledgerAccountId: string;
  dc: DebitCredit;
  amount: string;
  targetType?: JournalEntryTarget;
  targetId?: string;
  createdAt: Date;
  journal?: Journal;
  ledgerAccount?: Partial<LedgerAccount>;
}
