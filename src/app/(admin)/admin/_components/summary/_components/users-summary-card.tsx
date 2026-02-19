import { UsersIcon } from "@/components/icons";

import { EntitySummaryCard } from "./entity-summary-card";

type UsersSummaryCardProps = {
  readonly users: number;
};

export function UsersSummaryCard({ users }: UsersSummaryCardProps) {
  return <EntitySummaryCard title="کاربران" totalValue={users} icon={<UsersIcon />} href="/admin/users" />;
}
