"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { ActiveFilters, type EntityFilterConfig } from "@/components/filters";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useServerDataTable } from "@/hooks/general/use-server-data-table";

import { PaginatedResponseDto } from "@/types/api";
import { Account } from "@/types/entities/account.type";
import type { AccountFilters } from "./account-filter-config";
import { columns } from "./columns";

type Props = {
  data: PaginatedResponseDto<Account> | null;
  isLoading: boolean;
  error: unknown;
  filterConfig: EntityFilterConfig<AccountFilters>;
  filters: AccountFilters;
  onFiltersChange: (filters: AccountFilters) => void;
  onReset: () => void;
};

export function AccountsTable({ data, isLoading, error, filterConfig, filters, onFiltersChange, onReset }: Props) {
  // reuse server data table hook like users table
  const tableData = data?.data ?? [];
  const pageCount = data?.meta.totalPages ?? 0;

  const dataKey = React.useMemo(() => tableData.map((a) => a.id).join(","), [tableData]);

  const table = useServerDataTable({
    data: tableData,
    columns,
    pageCount
  });

  if (error) {
    return (
      <Card className="relative w-full overflow-auto rounded-xl bg-card max-h-[70vh]">
        <CardContent className="p-0">
          <div className="p-8 text-center">
            <p className="text-destructive">خطا در بارگذاری حساب‌ها</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="relative w-full overflow-auto rounded-xl bg-card max-h-[70vh]">
        <CardContent className="p-0">
          <div className="p-4 space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <ActiveFilters config={filterConfig} filters={filters} onFiltersChange={onFiltersChange} onReset={onReset} />
      <Card className="relative w-full overflow-auto rounded-xl bg-card max-h-[70vh]">
        <CardContent className="p-0">
          <DataTable key={dataKey} table={table} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}
