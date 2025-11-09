"use client";

import { CreateLoanDialog } from "./create-loan-dialog";
import { LoanFilters, LoanFiltersDialog } from "./loan-filters-dialog";

type Props = {
  filters: LoanFilters;
  onFiltersChange: (f: LoanFilters) => void;
  onReset: () => void;
};

export function LoansHeader({ filters, onFiltersChange, onReset }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">وام‌ها</h1>
        <p className="text-muted-foreground mt-1">مدیریت و مشاهده لیست وام‌ها</p>
      </div>
      <div className="flex items-center gap-2">
        <LoanFiltersDialog filters={filters} onFiltersChange={onFiltersChange} onReset={onReset} />
        <CreateLoanDialog />
      </div>
    </div>
  );
}
