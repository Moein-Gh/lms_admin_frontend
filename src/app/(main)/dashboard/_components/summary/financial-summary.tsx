"use client";

import { ArrowLeft, ArrowRight, Banknote, CreditCard, DollarSign, TrendingUp, Wallet } from "lucide-react";

import { FinancialMetricCard } from "@/components/financial/financial-metric-card";
import { FormattedDate } from "@/components/formatted-date";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useFinancialSummary } from "@/hooks/use-report";

const FinancialSummary = () => {
  const { data: summary, isLoading, error } = useFinancialSummary();

  if (isLoading) {
    return (
      <>
        {/* Mobile skeleton */}
        <div className="md:hidden">
          <div className="h-[140px] rounded-xl border bg-card text-card-foreground shadow animate-pulse" />
        </div>
        {/* Desktop skeleton */}
        <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[180px] rounded-xl border bg-card text-card-foreground shadow animate-pulse" />
          ))}
        </div>
      </>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">خطا در دریافت اطلاعات</div>;
  }

  if (!summary) {
    return null;
  }

  const cards = [
    { title: "موجودی نقد", icon: <Wallet className="size-4" />, metric: summary.cashOnHand },
    { title: "سپرده‌های مشتریان", icon: <Banknote className="size-4" />, metric: summary.customerDeposits },
    { title: "وام های قابل دریافت", icon: <CreditCard className="size-4" />, metric: summary.loansReceivable },
    { title: "کمیسیون صندوق", icon: <DollarSign className="size-4" />, metric: summary.totalIncomeEarned }
  ];

  return (
    <section className="space-y-4">
      {/* Mobile: Carousel */}
      <div className="md:hidden">
        <Carousel opts={{ direction: "rtl", loop: true }} className="w-full">
          {/* Header with navigation */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="size-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">خلاصه مالی</h2>
                <p className="text-xs text-muted-foreground">
                  آخرین بروزرسانی: <FormattedDate value={summary.asOfDate} />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CarouselNext className="static size-8 translate-y-0" size="icon" variant="outline">
                <ArrowRight className="size-4" />
              </CarouselNext>
              <CarouselPrevious className="static size-8 translate-y-0" size="icon" variant="outline">
                <ArrowLeft className="size-4" />
              </CarouselPrevious>
            </div>
          </div>
          <CarouselContent>
            {cards.map((card) => (
              <CarouselItem key={card.title}>
                <FinancialMetricCard title={card.title} icon={card.icon} metric={card.metric} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Desktop: Header + Grid */}
      <div className="hidden md:block">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <TrendingUp className="size-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">خلاصه مالی</h2>
            <p className="text-xs text-muted-foreground">
              آخرین بروزرسانی: <FormattedDate value={summary.asOfDate} />
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <FinancialMetricCard key={card.title} title={card.title} icon={card.icon} metric={card.metric} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FinancialSummary;
