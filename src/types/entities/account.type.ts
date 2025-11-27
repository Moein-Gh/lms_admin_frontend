import { BadgeVariant } from "@/components/ui/badge";
import { AccountBalanceSummary } from "./account-balance.type";
import { AccountType } from "./account-type.type";
import { User } from "./user.type";

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

export enum AccountStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  RESTRICTED = "restricted"
}

export type AccountStatusLabel = {
  readonly label: string;
  readonly badgeVariant: BadgeVariant;
};

export const AccountStatusLabels: Record<AccountStatus, AccountStatusLabel> = {
  [AccountStatus.ACTIVE]: { label: "فعال", badgeVariant: "default" },
  [AccountStatus.INACTIVE]: { label: "غیرفعال", badgeVariant: "inactive" },
  [AccountStatus.RESTRICTED]: { label: "دارای وام فعال", badgeVariant: "destructive" }
};
