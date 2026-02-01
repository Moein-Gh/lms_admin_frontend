"use client";

import { FileText } from "lucide-react";
import { EmptyStateCard } from "@/components/empty-state-card";
import { FormattedNumber } from "@/components/formatted-number";
import { PaginationControls } from "@/components/pagination-controls";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-current-user";
import { useLoans } from "@/hooks/use-loan";
import { usePagination } from "@/hooks/use-pagination";
import { LoanStatus } from "@/types/entities/loan.type";
import { ActiveLoanCard } from "./active-loan-card";

export function ActiveLoansList() {
  const { data: user } = useAuth();
  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });

  const { data, isLoading } = useLoans({
    page: pagination.page,
    pageSize: pagination.pageSize,
    status: LoanStatus.ACTIVE,
    userId: user?.id
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={`loan-skeleton-${i}`} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!data?.data.length) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold md:text-xl">وام‌های فعال</h2>
        <EmptyStateCard
          icon={<FileText className="size-10" />}
          title="هیچ وام فعالی یافت نشد"
          description="شما در حال حاضر وام فعالی ندارید."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold md:text-xl">وام‌های فعال</h2>
        <Badge variant="secondary">
          <FormattedNumber type="normal" value={data.meta.totalItems} /> وام
        </Badge>
      </div>

      <div className="flex flex-col gap-4">
        {data.data.map((loan) => (
          <ActiveLoanCard key={loan.id} loan={loan} href={`/loans/${loan.id}`} />
        ))}
      </div>

      {/* Pagination */}
      {data.meta.totalPages > 1 && (
        <PaginationControls
          meta={data.meta}
          page={pagination.page}
          pageSize={pagination.pageSize}
          onPageChange={pagination.setPage}
          onPageSizeChange={pagination.setPageSize}
        />
      )}
    </div>
  );
}
