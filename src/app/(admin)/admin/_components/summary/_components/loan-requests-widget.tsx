"use client";

import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";

import { FormattedNumber } from "@/components/formatted-number";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoanRequests } from "@/hooks/use-loan-request";
import { LoanRequestStatus } from "@/types/entities/loan-request.type";

export function LoanRequestsWidget() {
  const { data, isLoading, error } = useLoanRequests({ page: 1, pageSize: 10 });

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-card p-2.5">
        <Skeleton className="size-9 rounded-md" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="size-4" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Link
        href="/admin/loan-requests"
        className="group flex items-center gap-3 rounded-lg bg-card p-2.5 transition-colors hover:bg-accent/50"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive [&_svg]:size-4">
          <FileText />
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">درخواست‌های وام</p>
            <p className="text-sm text-destructive">خطا در بارگذاری</p>
          </div>
        </div>
        <ChevronLeft className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
      </Link>
    );
  }

  const items = Array.isArray(data) ? data : data.data;
  const totalCount = !Array.isArray(data) ? data.meta.totalItems : items.length;

  const stats = {
    pending: items.filter((item) => item.status === LoanRequestStatus.PENDING).length,
    approved: items.filter((item) => item.status === LoanRequestStatus.APPROVED).length,
    converted: items.filter((item) => item.status === LoanRequestStatus.CONVERTED).length
  };

  return (
    <Link
      href="/admin/loan-requests"
      className="group flex items-center gap-3 rounded-lg bg-card p-2.5 transition-colors hover:bg-accent/50"
    >
      {/* Icon with pending indicator */}
      <div className="relative">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary [&_svg]:size-4">
          <FileText />
        </div>
        {stats.pending > 0 && (
          <span className="absolute -end-0.5 -top-0.5 flex">
            <span className="absolute inline-flex size-2.5 animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-amber-500 ring-2 ring-card" />
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">درخواست‌های وام</p>
          <p className="text-base font-bold tabular-nums">
            <FormattedNumber type="normal" value={totalCount} />
          </p>
        </div>

        {/* Stats pills */}
        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          {stats.pending > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[10px]">
              <span className="text-muted-foreground">در انتظار:</span>
              <span className="font-semibold tabular-nums text-amber-600 dark:text-amber-400">
                <FormattedNumber type="normal" value={stats.pending} />
              </span>
            </div>
          )}
          {stats.approved > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[10px]">
              <span className="text-muted-foreground">تایید شده:</span>
              <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                <FormattedNumber type="normal" value={stats.approved} />
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ChevronLeft className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
    </Link>
  );
}
