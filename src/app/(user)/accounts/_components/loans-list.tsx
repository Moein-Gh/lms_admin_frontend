"use client";

import { FileText } from "lucide-react";
import { EmptyStateCard } from "@/components/empty-state-card";
import { PaginationControls } from "@/components/pagination-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/general/use-pagination";
import { useUserLoans } from "@/hooks/user/use-loan";
import { LoanCard } from "./loan-card";

interface LoansListProps {
  accountId: string;
}

export function LoansList({ accountId }: LoansListProps) {
  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });

  const { data, isLoading } = useUserLoans({
    page: pagination.page,
    pageSize: pagination.pageSize,
    accountId
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={`loan-skeleton-${i}`} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!data?.data.length) {
    return (
      <EmptyStateCard
        icon={<FileText className="size-10" />}
        title="هیچ وام‌ی یافت نشد"
        description="تاکنون وام‌ی برای این حساب ثبت نشده است."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {data.data.map((loan) => (
          <LoanCard key={loan.id} loan={loan} />
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
