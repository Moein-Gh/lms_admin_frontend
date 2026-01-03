import { BadgeVariant } from "@/components/ui/badge";
import { Identity } from "./identity.type";
import { LoanBalanceSummary } from "./loan-balane.type";
import { type RoleAssignment } from "./role-assignment.type";

export type UserBalanceSummary = {
  accounts: UserBalanceSummary[];
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

export type UserStatusLabel = {
  readonly label: string;
  readonly badgeVariant: BadgeVariant;
};

export const UserStatusLabels: Record<UserStatus, UserStatusLabel> = {
  [UserStatus.ACTIVE]: { label: "فعال", badgeVariant: "default" },
  [UserStatus.INACTIVE]: { label: "غیرفعال", badgeVariant: "inactive" }
};
