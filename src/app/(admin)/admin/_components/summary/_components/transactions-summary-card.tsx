import { TransactionIcon } from "@/components/icons";
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
      icon={<TransactionIcon />}
      pendingCount={transactions.pending}
      href="/admin/transactions"
      stats={[
        { label: "تخصیص", value: transactions.allocated, variant: "success" },
        { label: "در انتظار", value: transactions.pending, variant: "warning" }
      ]}
    />
  );
}
