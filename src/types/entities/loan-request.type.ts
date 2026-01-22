import { Account } from "./account.type";
import { LoanType } from "./loan-type.type";
import { User } from "./user.type";

export enum LoanRequestStatus {
  PENDING = "PENDING",
  IN_QUEUE = "IN_QUEUE",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CONVERTED = "CONVERTED"
}

export const LoanRequestStatusLabels: Record<LoanRequestStatus, string> = {
  [LoanRequestStatus.PENDING]: "در انتظار",
  [LoanRequestStatus.IN_QUEUE]: "در صف بررسی",
  [LoanRequestStatus.APPROVED]: "تایید شده",
  [LoanRequestStatus.REJECTED]: "رد شده",
  [LoanRequestStatus.CONVERTED]: "تبدیل شده"
};

export interface LoanRequest {
  id: string;
  code: number;

  accountId: string;
  account?: Account;

  loanTypeId: string;
  loanType?: LoanType;

  userId: string;
  user?: User;

  amount: string;
  startDate: Date;
  paymentMonths: number;
  status: LoanRequestStatus;
  note?: string;

  createdAt: Date;
  updatedAt: Date;
}
