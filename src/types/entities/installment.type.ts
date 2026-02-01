import type { Loan } from "./loan.type";

export enum InstallmentStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  PAID = "PAID",
  ALLOCATED = "ALLOCATED"
}

export interface Installment {
  id: string;
  code: number;
  loanId: string;
  installmentNumber: number;
  dueDate: Date;
  amount: string;
  status: InstallmentStatus;
  paymentDate?: Date;

  // relation
  loan?: Loan;

  // timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface InstallmentSummary {
  totalCount: number;
  paidCount: number;
  overdueCount: number;
  activeCount: number;
  pendingCount: number;
  totalAmount: string;
  amountPaid: string;
  amountOverdue: string;
  amountRemaining: string;
  paymentPercentage: number;
  expectedCompletionDate: Date | null;
  nextInstallmentDate: Date | null;
  nextInstallmentAmount: string | null;
  nextInstallmentNumber: number | null;
}
