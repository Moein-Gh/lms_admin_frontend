import type { JournalEntry } from "./journal-entry.type";
import type { Transaction } from "./transaction.type";

export enum JournalStatus {
  PENDING = "PENDING",
  POSTED = "POSTED",
  VOIDED = "VOIDED"
}

export interface Journal {
  id: string;
  code: number;
  transactionId?: string;
  postedAt?: Date;
  note?: string;
  status: JournalStatus;
  createdAt: Date;
  updatedAt: Date;

  transaction?: Transaction;
  entries?: JournalEntry[];
}
