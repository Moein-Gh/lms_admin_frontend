import { AccountType } from "./account-type.type";
import { User } from "./user.type";

export enum AccountStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  RESTRICTED = "restricted"
}

export type AccountBalanceSummary = {
  readonly accountId: string;
  readonly accountDeposits: {
    readonly count: number;
    readonly amount: number;
  };
  readonly subscriptionFeeDeposits: {
    readonly count: number;
    readonly amount: number;
  };
  readonly totalDeposits: number;
};

export interface Account {
  id: string;
  code: number;
  accountTypeId: string;
  name: string;
  userId: string;
  cardNumber: string;
  bankName: string;
  status: AccountStatus;

  createdAt: Date;
  updatedAt: Date;

  accountType?: AccountType;
  user?: User;

  balanceSummary?: AccountBalanceSummary;
}
