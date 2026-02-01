"use client";

import { EmptyStateCard } from "@/components/empty-state-card";
import { PaginationControls } from "@/components/pagination-controls";
import { useAuth } from "@/hooks/use-current-user";
import { usePagination } from "@/hooks/use-pagination";
import { useTransactions } from "@/hooks/use-transaction";
import { TransactionCard } from "../_components/transaction-card";

export default function UserTransactionsPage() {
  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });
  const { data: user } = useAuth();

  // Get current user's transactions only
  const { data, isLoading, error } = useTransactions({
    page: pagination.page,
    pageSize: pagination.pageSize,
    userId: user?.id
  });

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold md:text-3xl">تراکنش‌های من</h1>
          <p className="text-sm text-muted-foreground md:text-base">مشاهده تمام تراکنش‌های شما</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={`skeleton-${i}`} className="h-24 rounded-lg border bg-card animate-pulse" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <EmptyStateCard
            title="خطا در بارگذاری"
            description="امکان بارگذاری تراکنش‌ها وجود ندارد. لطفاً دوباره تلاش کنید."
          />
        )}

        {/* Empty State */}
        {!isLoading && !error && data && data.data.length === 0 && (
          <EmptyStateCard title="تراکنشی یافت نشد" description="هنوز هیچ تراکنشی ثبت نشده است." />
        )}

        {/* Transactions List */}
        {!isLoading && !error && data && data.data.length > 0 && (
          <>
            <div className="space-y-3">
              {data.data.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>

            {/* Pagination */}
            {data.meta.totalPages > 1 && (
              <div className="flex justify-center pt-4">
                <PaginationControls
                  meta={data.meta}
                  page={pagination.page}
                  pageSize={pagination.pageSize}
                  onPageChange={pagination.setPage}
                  onPageSizeChange={pagination.setPageSize}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
