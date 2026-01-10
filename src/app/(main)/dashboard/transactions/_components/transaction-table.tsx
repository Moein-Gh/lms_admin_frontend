"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { ActiveFilters, type EntityFilterConfig } from "@/components/filters";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useServerDataTable } from "@/hooks/use-server-data-table";
import { PaginatedResponseDto } from "@/types/api";
import { Transaction } from "@/types/entities/transaction.type";
import { columns } from "./columns";
import type { TransactionFilters } from "./transaction-filter-config";

type Props = {
  data: PaginatedResponseDto<Transaction> | null;
  isLoading: boolean;
  error: unknown;
  filterConfig: EntityFilterConfig<TransactionFilters>;
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  onReset: () => void;
};

export function TransactionsTable({ data, isLoading, error, filterConfig, filters, onFiltersChange, onReset }: Props) {
  const tableData = data?.data ?? [];
  const pageCount = data?.meta.totalPages ?? 0;

  // Create a stable key based on data IDs to force re-render when data changes
  const dataKey = React.useMemo(() => tableData.map((transaction) => transaction.id).join(","), [tableData]);

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
            <p className="text-destructive">خطا در بارگذاری تراکنش‌ها</p>
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
            {Array.from({ length: 5 }).map((_, i) => (
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
