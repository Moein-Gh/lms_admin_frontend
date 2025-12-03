import { ArrowLeftRight } from "lucide-react";

import { EntitySummaryCard } from "./entity-summary-card";

type TransactionsSummaryCardProps = {
  readonly transactions: {
    readonly total: number;
    readonly pending: number;
    readonly allocated: number;
  };
};

export function TransactionsSummaryCard({ transactions }: TransactionsSummaryCardProps) {
  return (
    <EntitySummaryCard
      title="تراکنش‌ها"
      totalValue={transactions.total}
      icon={<ArrowLeftRight />}
      pendingCount={transactions.pending}
      href="/dashboard/transactions"
      stats={[
        { label: "تخصیص", value: transactions.allocated, variant: "success" },
        { label: "در انتظار", value: transactions.pending, variant: "warning" }
      ]}
    />
  );
}
