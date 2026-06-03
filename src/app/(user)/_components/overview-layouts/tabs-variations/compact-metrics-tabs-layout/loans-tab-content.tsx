"use client";

import { FormattedNumber } from "@/components/formatted-number";
import { LoanIcon } from "@/components/icons";

import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { CompactMetricsTabContentProps } from "./types";

type LoansTabContentProps = CompactMetricsTabContentProps & {
  readonly loanProgressPercentage: number;
};

export function LoansTabContent({ overview, loanProgressPercentage }: LoansTabContentProps) {
  const paidAmount = Number.parseFloat(overview.totalLoanPaid) || 0;
  const outstandingAmount = Number.parseFloat(overview.totalLoanOutstanding) || 0;
  const total = paidAmount + outstandingAmount;
  const paidRatio = total > 0 ? (paidAmount / total) * 100 : 0;
  const safePaidRatio = Math.min(100, Math.max(0, paidRatio));
  const safeProgress = Math.min(100, Math.max(0, loanProgressPercentage));

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500/30 to-orange-500/10 text-orange-600 shadow-md ring-1 ring-orange-500/20 dark:text-orange-400">
          <LoanIcon className="size-7" />
        </div>

        <div className="flex flex-1 items-center gap-3 md:gap-4">
          <div className="flex-1">
            <p className="text-base font-medium text-muted-foreground">مبلغ کل وام‌ها</p>
            <p className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              <FormattedNumber type="price" value={overview.totalLoanAmount} />
            </p>
          </div>

          <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-12 bg-border" />
          <div className="flex w-[30%] shrink-0 flex-col items-center gap-1 rounded-xl bg-card/40 px-3 py-2 text-center md:w-[10%] md:px-4 md:py-2.5">
            <span className="text-lg md:text-xl font-bold text-primary">
              <FormattedNumber type="normal" value={overview.activeLoansCount} />
            </span>
            <span className="text-xs text-muted-foreground">وام فعال</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3 sm:gap-6 [direction:ltr]">
          <div className="text-start">
            <p className="text-[11px] text-muted-foreground">باقیمانده</p>
            <p className="mt-1 text-sm font-bold text-rose-600 dark:text-rose-500">
              <FormattedNumber type="price" value={overview.totalLoanOutstanding} />
            </p>
          </div>
          <div className="text-end">
            <p className="text-[11px] text-muted-foreground">پرداخت شده</p>
            <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-500">
              <FormattedNumber type="price" value={overview.totalLoanPaid} />
            </p>
          </div>
        </div>

        <Progress value={safePaidRatio} className="h-2.5 bg-muted [direction:ltr]" />
      </div>
    </div>
  );
}
