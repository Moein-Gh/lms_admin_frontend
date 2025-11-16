"use client";

import { CreateTransactionDialog } from "./create-transaction-dialog";
import { TransactionFilters } from "./transaction-filters";

type Props = {
  filters: TransactionFilters;
  onFiltersChange: (f: TransactionFilters) => void;
  onReset: () => void;
};

export function TransactionsHeader({ filters, onFiltersChange, onReset }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">وام‌ها</h1>
        <p className="text-muted-foreground mt-1">مدیریت و مشاهده لیست وام‌ها</p>
      </div>
      <div className="flex items-center gap-2">
        <TransactionFilters filters={filters} onFiltersChange={onFiltersChange} onReset={onReset} />
        <CreateTransactionDialog />
      </div>
    </div>
  );
}
