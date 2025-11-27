import * as React from "react";
import { useQueries } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Label, Pie, PieChart, XAxis } from "recharts";

import { FormattedNumber } from "@/components/formatted-number";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { loanKeys } from "@/hooks/use-loan";
import { getLoanById } from "@/lib/loan-api";
import { LoanBalanceSummary } from "@/types/entities/loan-balane.type";

type LoanChartsProps = {
  userId: string;
  balance?: LoanBalanceSummary[];
};

const chartConfig = {
  paid: {
    label: "پرداخت شده",
    color: "var(--chart-2)"
  },
  remaining: {
    label: "باقی‌مانده",
    color: "var(--chart-5)"
  }
} satisfies ChartConfig;

export default function LoanCharts({ balance = [] }: LoanChartsProps) {
  const loanQueries = useQueries({
    queries: balance.map((item) => ({
      queryKey: loanKeys.detail(item.loanId),
      queryFn: () => getLoanById(item.loanId)
    }))
  });

  const loans = React.useMemo(() => loanQueries.map((q) => q.data).filter((l) => !!l), [loanQueries]);

  // --- Chart 1 Data: Donut Overview ---
  const totalStats = React.useMemo(() => {
    return balance.reduce(
      (acc, curr) => {
        acc.totalPaid += curr.repayments.amount;
        acc.totalRemaining += curr.outstandingBalance;
        acc.totalLoanAmount += curr.loanAmount;
        return acc;
      },
      { totalPaid: 0, totalRemaining: 0, totalLoanAmount: 0 }
    );
  }, [balance]);

  const pieData = React.useMemo(
    () => [
      {
        name: "paid",
        value: totalStats.totalPaid,
        fill: "var(--color-paid)"
      },
      {
        name: "remaining",
        value: totalStats.totalRemaining,
        fill: "var(--color-remaining)"
      }
    ],
    [totalStats]
  );

  // --- Chart 2 Data: Stacked Bar Progress ---
  const barData = React.useMemo(() => {
    return balance.map((item) => {
      const loan = loans.find((l) => l.id === item.loanId);
      const name = loan?.name ?? loan?.loanType?.name ?? `وام ${item.loanAmount.toLocaleString("fa-IR")}`;

      return {
        name: name,
        paid: item.repayments.amount,
        remaining: item.outstandingBalance,
        total: item.loanAmount
      };
    });
  }, [balance, loans]);

  if (balance.length === 0) return null;

  return (
    <Carousel className="w-full" opts={{ direction: "rtl", loop: true }}>
      <CarouselContent>
        {/* Chart 1: Debt Overview (Donut) */}
        <CarouselItem>
          <Card className="flex flex-col h-full bg-card">
            <CardHeader className="items-center pb-0">
              <CardTitle>وضعیت کلی وام‌ها</CardTitle>
              <CardDescription>پرداخت شده vs باقی‌مانده</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                {totalStats.totalRemaining.toLocaleString("fa-IR")}
                              </tspan>
                              <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-muted-foreground">
                                باقی‌مانده
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
              <div className="mt-4 grid grid-cols-2 gap-4 text-center text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">کل مبلغ وام‌ها</span>
                  <span className="font-bold">
                    <FormattedNumber value={totalStats.totalLoanAmount} />
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">تعداد وام فعال</span>
                  <span className="font-bold">
                    <FormattedNumber value={balance.length} />
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CarouselItem>

        {/* Chart 2: Per-Loan Progress (Stacked Bar) */}
        <CarouselItem>
          <Card className="flex flex-col h-full border-none shadow-none bg-card">
            <CardHeader className="items-center pb-0">
              <CardTitle>پیشرفت وام‌ها</CardTitle>
              <CardDescription>وضعیت پرداخت هر وام</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer config={chartConfig} className="mx-auto max-h-[200px] w-full">
                <BarChart
                  accessibilityLayer
                  data={barData}
                  margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="paid" stackId="a" fill="var(--color-paid)" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="remaining" stackId="a" fill="var(--color-remaining)" radius={[4, 4, 0, 0]} />
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}
