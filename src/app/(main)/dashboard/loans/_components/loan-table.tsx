"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useServerDataTable } from "@/hooks/use-server-data-table";
import { PaginatedResponseDto } from "@/types/api";
import { Loan } from "@/types/entities/loan.type";
import { columns } from "./columns";

type Props = {
  data: PaginatedResponseDto<Loan> | null;
  isLoading: boolean;
  error: unknown;
};

export function LoansTable({ data, isLoading, error }: Props) {
  const tableData = data?.data ?? [];
  const pageCount = data?.meta.totalPages ?? 0;

  // Create a stable key based on data IDs to force re-render when data changes
  const dataKey = React.useMemo(() => tableData.map((loan) => loan.id).join(","), [tableData]);

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
            <p className="text-destructive">خطا در بارگذاری وام‌ها</p>
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
      <Card className="relative w-full overflow-auto rounded-xl bg-card max-h-[70vh]">
        <CardContent className="p-0">
          <DataTable key={dataKey} table={table} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}
