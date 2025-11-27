import { AccountBalanceSummary } from "./account-balance.type";
import { Identity } from "./identity.type";
import { LoanBalanceSummary } from "./loan-balane.type";

export type UserBalanceSummary = {
  accounts: AccountBalanceSummary[];
  loans: LoanBalanceSummary[];
};

export interface User {
  id: string;
  code: number;
  isActive: boolean;
  identityId: string;
  identity: Partial<Identity>;

  balanceSummary?: UserBalanceSummary;
}
