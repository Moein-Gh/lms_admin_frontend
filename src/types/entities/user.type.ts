import { AccountBalanceSummary } from "./account-balance.type";
import { Identity } from "./identity.type";
import { LoanBalanceSummary } from "./loan-balane.type";
import { type RoleAssignment } from "./role-assignment.type";

export type UserBalanceSummary = {
  accounts: AccountBalanceSummary[];
  loans: LoanBalanceSummary[];
};

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

export interface User {
  id: string;
  code: number;
  status: UserStatus;
  identityId: string;
  identity: Partial<Identity>;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string | null;

  balanceSummary?: UserBalanceSummary;
  roleAssignments?: RoleAssignment[];
}
