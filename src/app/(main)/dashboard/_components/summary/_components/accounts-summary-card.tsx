import { Wallet } from "lucide-react";

import { EntitySummaryCard } from "./entity-summary-card";

type AccountsSummaryCardProps = {
  readonly accounts: {
    readonly total: number;
    readonly active: number;
    readonly restricted: number;
  };
};

export function AccountsSummaryCard({ accounts }: AccountsSummaryCardProps) {
  return (
    <EntitySummaryCard
      title="حساب‌ها"
      totalValue={accounts.total}
      icon={<Wallet />}
      href="/dashboard/accounts"
      stats={[
        { label: "فعال", value: accounts.active, variant: "success" },
        { label: "محدود", value: accounts.restricted, variant: "warning" }
      ]}
    />
  );
}
