"use client";

import { Banknote, CreditCard, DollarSign, Wallet } from "lucide-react";

import { FinancialMetricCard } from "@/components/financial/financial-metric-card";
import { useFinancialSummary } from "@/hooks/use-report";

const Summary = () => {
  const { data: summary, isLoading, error } = useFinancialSummary();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[200px] rounded-xl border bg-card text-card-foreground shadow animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">خطا در دریافت اطلاعات</div>;
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <FinancialMetricCard title="موجودی نقد" icon={<Wallet className="h-4 w-4" />} metric={summary.cashOnHand} />
      <FinancialMetricCard
        title="سپرده‌های مشتریان"
        icon={<Banknote className="h-4 w-4" />}
        metric={summary.customerDeposits}
      />
      <FinancialMetricCard
        title="تسهیلات جاری"
        icon={<CreditCard className="h-4 w-4" />}
        metric={summary.loansReceivable}
      />
      <FinancialMetricCard
        title="درآمد کل"
        icon={<DollarSign className="h-4 w-4" />}
        metric={summary.totalIncomeEarned}
      />
    </div>
  );
};

export default Summary;
