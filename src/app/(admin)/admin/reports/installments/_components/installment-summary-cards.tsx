"use client";

import { ArrowLeft, ArrowRight, CalendarClock, CheckCircle2, Clock } from "lucide-react";

import { InstallmentMetricCard } from "@/components/financial/installment-metric-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { type CurrentMonthBreakdown } from "@/types/entities/installment-projection.type";

interface InstallmentSummaryCardsProps {
  readonly data: CurrentMonthBreakdown;
}

export function InstallmentSummaryCards({ data }: InstallmentSummaryCardsProps) {
  const cards = [
    {
      title: "اقساط انتظاری ماه جاری",
      count: data.expected.count,
      totalAmount: data.expected.totalAmount,
      icon: <CalendarClock className="size-4" />
    },
    {
      title: "پرداخت شده ماه جاری",
      count: data.paid.count,
      totalAmount: data.paid.totalAmount,
      icon: <CheckCircle2 className="size-4" />
    },
    {
      title: "در انتظار ماه جاری",
      count: data.pending.count,
      totalAmount: data.pending.totalAmount,
      icon: <Clock className="size-4" />
    }
  ];

  return (
    <section className="space-y-4">
      {/* Mobile: Carousel */}
      <div className="md:hidden">
        <Carousel opts={{ direction: "rtl", loop: true }} className="w-full">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">خلاصه ماه جاری</h2>
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
                <InstallmentMetricCard {...card} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:block">
        <h2 className="mb-4 text-lg font-semibold">خلاصه ماه جاری</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <InstallmentMetricCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
