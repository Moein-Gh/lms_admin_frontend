"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { UserFilters } from "./user-filters-dialog";

type Props = {
  filters: UserFilters;
  onReset: () => void;
};

export function ActiveFilters({ filters, onReset }: Props) {
  if (!filters.search && filters.isActive === undefined) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm">فیلترهای فعال:</span>
      {filters.search && <Badge variant="secondary">جستجو: {filters.search}</Badge>}
      {filters.isActive !== undefined && (
        <Badge variant="secondary">وضعیت: {filters.isActive ? "فعال" : "غیرفعال"}</Badge>
      )}
      <Button variant="ghost" size="sm" onClick={onReset} className="h-6 px-2 text-xs">
        پاک کردن همه
      </Button>
    </div>
  );
}
