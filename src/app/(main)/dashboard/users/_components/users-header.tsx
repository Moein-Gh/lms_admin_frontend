"use client";

import { CreateUserDialog } from "./create-user-dialog";
import { UserFilters, UserFiltersDialog } from "./user-filters-dialog";

type Props = {
  filters: UserFilters;
  onFiltersChange: (f: UserFilters) => void;
  onReset: () => void;
};

export function UsersHeader({ filters, onFiltersChange, onReset }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">کاربران</h1>
        <p className="text-muted-foreground mt-1">مدیریت و مشاهده لیست کاربران</p>
      </div>
      <div className="flex items-center gap-2">
        <UserFiltersDialog filters={filters} onFiltersChange={onFiltersChange} onReset={onReset} />
        <CreateUserDialog />
      </div>
    </div>
  );
}
