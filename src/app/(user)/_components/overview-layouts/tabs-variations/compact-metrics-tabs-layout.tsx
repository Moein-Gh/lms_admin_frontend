"use client";

import { useState } from "react";
import { Wallet, CreditCard, CircleDollarSign, Coins } from "lucide-react";
import { FormattedNumber } from "@/components/formatted-number";
import { useUserOverview } from "@/hooks/user/use-dashboard";
import { cn } from "@/lib/utils";

type TabType = "accounts" | "loans";

export function CompactMetricsTabsLayout() {
  const { data: overview, isLoading } = useUserOverview();
  const [activeTab, setActiveTab] = useState<TabType>("accounts");

  if (isLoading || !overview) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  const loanProgressPercentage = Math.min(100, Math.max(0, overview.loanPaymentPercentage));

  return (
    <div className="space-y-3">
      {/* Compact Segmented Control */}
      <div className="flex rounded-lg border bg-muted/30 p-1">
        <button
          onClick={() => setActiveTab("accounts")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
            activeTab === "accounts"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Wallet className="size-4" />
          حساب‌ها
        </button>
        <button
          onClick={() => setActiveTab("loans")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
            activeTab === "loans"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <CreditCard className="size-4" />
          وام‌ها
        </button>
      </div>

      {/* Compact Content */}
      <div className="rounded-lg border bg-card">
        {activeTab === "accounts" ? (
          <div className="p-4">
            {/* Single Line Layout with Icon */}
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-green-500/20 to-green-500/5 text-green-600 shadow-sm dark:text-green-500">
                <Wallet className="size-6" />
              </div>

              <div className="flex flex-1 items-center gap-3 md:gap-4">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">موجودی کل حساب‌ها</p>
                  <p className="mt-0.5 text-2xl font-bold tracking-tight md:text-3xl">
                    <FormattedNumber type="price" value={overview.totalAccountBalance} />
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 md:px-4 md:py-2.5">
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                    <span className="text-sm font-bold text-primary">
                      <FormattedNumber type="normal" value={overview.activeAccountsCount} />
                    </span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">حساب فعال</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {/* Main Loan Header */}
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-orange-500/20 to-orange-500/5 text-orange-600 shadow-sm dark:text-orange-500">
                <CreditCard className="size-6" />
              </div>

              <div className="flex flex-1 items-center gap-3 md:gap-4">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">مبلغ کل وام‌ها</p>
                  <p className="mt-0.5 text-2xl font-bold tracking-tight md:text-3xl">
                    <FormattedNumber type="price" value={overview.totalLoanAmount} />
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 md:px-4 md:py-2.5">
                  <div className="flex size-8 items-center justify-center rounded-md bg-orange-500/10">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-500">
                      <FormattedNumber type="normal" value={overview.activeLoansCount} />
                    </span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">وام فعال</span>
                </div>
              </div>
            </div>

            {/* Payment Details Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/5 p-2.5">
                <div className="flex size-7 items-center justify-center rounded-md bg-green-500/10">
                  <span className="text-xs font-bold text-green-600 dark:text-green-500">✓</span>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-medium text-green-600 dark:text-green-500">پرداخت شده</p>
                  <p className="mt-0.5 text-xs font-bold">
                    <FormattedNumber type="price" value={overview.totalLoanPaid} />
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-2.5">
                <div className="flex size-7 items-center justify-center rounded-md bg-red-500/10">
                  <span className="text-xs font-bold text-red-600 dark:text-red-500">○</span>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-medium text-red-600 dark:text-red-500">باقیمانده</p>
                  <p className="mt-0.5 text-xs font-bold">
                    <FormattedNumber type="price" value={overview.totalLoanOutstanding} />
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {overview.activeLoansCount > 0 && (
              <div className="space-y-2 rounded-lg border bg-gradient-to-bl from-primary/5 to-transparent p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">پیشرفت پرداخت</span>
                  <span className="text-lg font-bold text-primary">
                    <FormattedNumber type="normal" value={loanProgressPercentage.toFixed(0)} />٪
                  </span>
                </div>
                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-linear-to-l from-primary via-primary/90 to-primary/70 shadow-sm transition-all duration-700"
                    style={{ width: `${loanProgressPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
