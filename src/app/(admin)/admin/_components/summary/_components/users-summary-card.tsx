import { Users } from "lucide-react";

import { EntitySummaryCard } from "./entity-summary-card";

type UsersSummaryCardProps = {
  readonly users: number;
};

export function UsersSummaryCard({ users }: UsersSummaryCardProps) {
  return <EntitySummaryCard title="کاربران" totalValue={users} icon={<Users />} href="/admin/users" />;
}
