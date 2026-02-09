"use client";

import { Wallet, TrendingUp, Percent, CreditCard } from "lucide-react";
import { FormattedNumber } from "@/components/formatted-number";
import { useUserOverview } from "@/hooks/user/use-dashboard";
import { cn } from "@/lib/utils";

const OverviewCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default"
}: {
  readonly title: string;
  readonly value: string | number | React.ReactNode;
  readonly subtitle?: string;
  readonly icon: typeof Wallet;
  readonly variant?: "default" | "success" | "warning" | "info";
}) => {
  const variantStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-green-500/10 text-green-600 dark:text-green-500",
    warning: "bg-orange-500/10 text-orange-600 dark:text-orange-500",
    info: "bg-blue-500/10 text-blue-600 dark:text-blue-500"
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card p-4 transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={cn("rounded-lg p-2.5 transition-colors", variantStyles[variant])}>
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-lg border bg-card p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 space-y-2">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="h-3 w-20 animate-pulse rounded bg-muted" />
      </div>
      <div className="size-10 animate-pulse rounded-lg bg-muted" />
    </div>
  </div>
);

export function UserOverviewSection() {
  const { data: overview, isLoading, error } = useUserOverview();

  // Loading state
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  // Error state
  if (error || !overview) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
        <p className="text-sm text-destructive">خطا در بارگذاری اطلاعات</p>
      </div>
    );
  }

  const loanProgressPercentage = Math.min(100, Math.max(0, overview.loanPaymentPercentage));

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="موجودی کل حساب‌ها"
          value={<FormattedNumber type="price" value={overview.totalAccountBalance} />}
          subtitle={`${overview.activeAccountsCount} حساب فعال`}
          icon={Wallet}
          variant="success"
        />

        <OverviewCard
          title="تعداد وام‌های فعال"
          value={overview.activeLoansCount}
          subtitle={overview.activeLoansCount > 0 ? "وام فعال" : "بدون وام"}
          icon={CreditCard}
          variant="info"
        />

        <OverviewCard
          title="مبلغ کل وام‌ها"
          value={<FormattedNumber type="price" value={overview.totalLoanAmount} />}
          subtitle={
            overview.activeLoansCount > 0
              ? `${overview.activeLoansCount} ${overview.activeLoansCount === 1 ? "وام" : "وام"}`
              : undefined
          }
          icon={TrendingUp}
          variant="warning"
        />

        <OverviewCard
          title="باقیمانده بدهی"
          value={<FormattedNumber type="price" value={overview.totalLoanOutstanding} />}
          subtitle={overview.activeLoansCount > 0 ? `${loanProgressPercentage.toFixed(0)}٪ پرداخت شده` : undefined}
          icon={Percent}
          variant="default"
        />
      </div>

      {/* Loan Progress Bar (if user has active loans) */}
      {overview.activeLoansCount > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">پیشرفت پرداخت وام‌ها</span>
              <span className="text-muted-foreground">{loanProgressPercentage.toFixed(1)}٪</span>
            </div>
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-l from-primary to-primary/80 transition-all duration-500"
                style={{ width: `${loanProgressPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                پرداخت شده:{" "}
                <FormattedNumber type="price" value={overview.totalLoanPaid} className="font-medium text-foreground" />
              </span>
              <span>
                باقیمانده:{" "}
                <FormattedNumber
                  type="price"
                  value={overview.totalLoanOutstanding}
                  className="font-medium text-foreground"
                />
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
