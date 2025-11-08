"use client";

import { AccountFilters, AccountFiltersDialog } from "./account-filters-dialog";
import { CreateAccountDialog } from "./create-account-dialog";

type Props = {
  filters: AccountFilters;
  onFiltersChange: (f: AccountFilters) => void;
  onReset: () => void;
};

export function AccountsHeader({ filters, onFiltersChange, onReset }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">حساب‌ها</h1>
        <p className="text-muted-foreground mt-1">مدیریت و مشاهده لیست حساب‌ها</p>
      </div>
      <div className="flex items-center gap-2">
        <AccountFiltersDialog filters={filters} onFiltersChange={onFiltersChange} onReset={onReset} />
        <CreateAccountDialog />
      </div>
    </div>
  );
}
