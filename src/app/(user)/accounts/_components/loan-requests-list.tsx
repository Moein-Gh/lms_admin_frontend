"use client";

import { Calendar, HandCoins } from "lucide-react";
import { EmptyStateCard } from "@/components/empty-state-card";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { PaginationControls } from "@/components/pagination-controls";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoanRequests } from "@/hooks/admin/use-loan-request";
import { usePagination } from "@/hooks/general/use-pagination";
import { cn } from "@/lib/utils";
import { LoanRequestStatus, LoanRequestStatusLabels } from "@/types/entities/loan-request.type";

interface LoanRequestsListProps {
  accountId: string;
}

export function LoanRequestsList({ accountId }: LoanRequestsListProps) {
  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });

  const { data, isLoading } = useLoanRequests({
    page: pagination.page,
    pageSize: pagination.pageSize,
    accountId
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={`loan-request-skeleton-${i}`} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!data?.data.length) {
    return (
      <EmptyStateCard
        icon={<HandCoins className="size-10" />}
        title="هیچ درخواست وامی یافت نشد"
        description="شما می‌توانید با استفاده از این حساب درخواست وام ثبت کنید."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {data.data.map((request) => {
          const isPending = request.status === LoanRequestStatus.PENDING;
          const isInQueue = request.status === LoanRequestStatus.IN_QUEUE;
          const isApproved = request.status === LoanRequestStatus.APPROVED;
          const isRejected = request.status === LoanRequestStatus.REJECTED;
          const isConverted = request.status === LoanRequestStatus.CONVERTED;

          return (
            <Card key={request.id} className="p-4 ">
              <div className="flex flex-col gap-3">
                {/* Top Row: All Badges */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isApproved || isConverted ? "default" : isPending || isInQueue ? "outline" : "secondary"}
                      className={cn(
                        isApproved && "bg-green-600 dark:bg-green-900 text-white",
                        isConverted && "bg-purple-600 dark:bg-purple-900 text-white",
                        isPending && "bg-amber-500 dark:bg-amber-900 text-white",
                        isInQueue && "bg-blue-500 dark:bg-blue-900 text-white",
                        isRejected && "bg-red-600 dark:bg-red-900 text-white"
                      )}
                    >
                      {LoanRequestStatusLabels[request.status]}
                    </Badge>
                    <Badge variant="secondary">{request.loanType?.name ?? "نامشخص"}</Badge>
                  </div>
                  <Badge variant="outline">
                    کد درخواست:
                    <FormattedNumber type="normal" value={request.code} />
                  </Badge>
                </div>

                {/* Bottom Row: Date/Months & Amount */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      <FormattedDate value={request.createdAt} />
                    </span>
                    {request.paymentMonths && (
                      <span className="flex items-center gap-1">
                        <FormattedNumber type="normal" value={request.paymentMonths} />
                        <span>ماه</span>
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-foreground shrink-0">
                    <FormattedNumber type="price" value={request.amount} />
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
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
