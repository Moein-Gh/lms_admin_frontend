import { CardIcon } from "@/components/icons";

import { EntitySummaryCard } from "./entity-summary-card";

type LoansSummaryCardProps = {
  readonly loans: {
    readonly total: number;
    readonly active: number;
    readonly pending: number;
  };
};

export function LoansSummaryCard({ loans }: LoansSummaryCardProps) {
  return (
    <EntitySummaryCard
      title="وام‌ها"
      totalValue={loans.total}
      icon={<CardIcon />}
      pendingCount={loans.pending}
      href="/admin/loans"
      stats={[
        { label: "فعال", value: loans.active, variant: "success" },
        { label: "در انتظار", value: loans.pending, variant: "warning" }
      ]}
    />
  );
}
