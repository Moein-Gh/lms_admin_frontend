import { Account } from "@/types/entities/account.type";

export type GradientStyle = "subtle" | "accent" | "dark";

export type GradientCardProps = {
  account: Account;
};

export type ExpandableCardProps = GradientCardProps & {
  isExpanded: boolean;
  onToggle: () => void;
};
