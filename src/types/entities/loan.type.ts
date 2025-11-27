import { Account } from "./account.type";
import { LoanBalanceSummary } from "./loan-balane.type";
import { LoanType } from "./loan-type.type";

export enum LoanStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED"
}

export interface Loan {
  id: string;
  code: number;
  name: string;

  accountId: string;
  account?: Account;

  loanTypeId: string;
  loanType?: LoanType;

  amount: string;

  startDate: Date;
  paymentMonths: number;
  status: LoanStatus;

  createdAt: Date;
  updatedAt: Date;

  balanceSummary?: LoanBalanceSummary;
}
