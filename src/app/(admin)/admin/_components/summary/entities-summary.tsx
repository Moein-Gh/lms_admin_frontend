"use client";

import { LayoutGrid } from "lucide-react";

import { useEntitiesSummary } from "@/hooks/admin/use-report";

import { AccountsSummaryCard } from "./_components/accounts-summary-card";
import { EntitySummaryError } from "./_components/entity-summary-error";
import { EntitySummarySectionHeader } from "./_components/entity-summary-section-header";
import { EntitySummarySkeleton } from "./_components/entity-summary-skeleton";
import { LoansSummaryCard } from "./_components/loans-summary-card";
import { TransactionsSummaryCard } from "./_components/transactions-summary-card";
import { UsersSummaryCard } from "./_components/users-summary-card";

const EntitiesSummary = () => {
  const { data: summary, isLoading, error, refetch } = useEntitiesSummary();

  if (isLoading) {
    return <EntitiesSummaryLoading />;
  }

  if (error) {
    return (
      <section className="space-y-2">
        <EntitySummarySectionHeader title="خلاصه موجودیت‌ها" icon={<LayoutGrid className="size-3.5" />} />
        <EntitySummaryError onRetry={() => refetch()} />
      </section>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <section className="space-y-2">
      <EntitySummarySectionHeader
        title="خلاصه موجودیت‌ها"
        subtitle="نمای کلی از اطلاعات سیستم"
        icon={<LayoutGrid className="size-4" />}
      />
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
        <UsersSummaryCard users={summary.users} />
        <AccountsSummaryCard accounts={summary.accounts} />
        <LoansSummaryCard loans={summary.loans} />
        <TransactionsSummaryCard transactions={summary.transactions} />
      </div>
    </section>
  );
};

function EntitiesSummaryLoading() {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-1.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <LayoutGrid className="size-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">خلاصه موجودیت‌ها</h2>
          <p className="text-[10px] text-muted-foreground">نمای کلی از اطلاعات سیستم</p>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {["users", "accounts", "loans", "transactions"].map((key) => (
          <EntitySummarySkeleton key={key} />
        ))}
      </div>
    </section>
  );
}

export default EntitiesSummary;
