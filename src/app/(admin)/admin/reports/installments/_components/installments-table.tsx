"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { DataCardSkeleton } from "@/components/ui/data-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useServerDataTable } from "@/hooks/use-server-data-table";
import { type InstallmentWithRelations } from "@/types/entities/installment-projection.type";

import { columns } from "./columns";
import { InstallmentsCardList } from "./installments-card-list";

interface InstallmentsTableProps {
  readonly installments: InstallmentWithRelations[];
  readonly title: string;
  readonly pageCount: number;
  readonly isLoading?: boolean;
}

export function InstallmentsTable({ installments, title, pageCount, isLoading = false }: InstallmentsTableProps) {
  const dataKey = React.useMemo(() => installments.map((item) => item.id).join(","), [installments]);

  const table = useServerDataTable({
    data: installments,
    columns,
    pageCount
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {/* Mobile skeleton */}
        <div className="md:hidden">
          <DataCardSkeleton count={5} />
        </div>
        {/* Desktop skeleton */}
        <Card className="relative hidden w-full overflow-auto rounded-xl bg-card md:block">
          <CardContent className="p-0">
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
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
      </div>
    );
  }

  if (installments.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Card className="relative w-full overflow-auto rounded-xl bg-card">
          <CardContent className="p-0">
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">داده‌ای برای نمایش وجود ندارد</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>

      {/* Mobile view - Card list */}
      <div className="md:hidden">
        <InstallmentsCardList installments={installments} />
      </div>

      {/* Desktop view - Table */}
      <Card className="relative hidden w-full overflow-auto rounded-xl bg-card max-h-[70vh] md:block">
        <CardContent className="p-0">
          <DataTable key={dataKey} table={table} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}
