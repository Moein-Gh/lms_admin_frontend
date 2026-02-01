"use client";

import * as React from "react";
import { IdCard } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Label, LabelList, Pie, PieChart, XAxis } from "recharts";

import { EmptyStateCard } from "@/components/empty-state-card";
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
import { useAccounts } from "@/hooks/use-account";
import { AccountBalanceSummary } from "@/types/entities/account-balance.type";

type AccountChartsProps = {
  userId: string;
  summary: AccountBalanceSummary[];
};

const chartConfig = {
  deposit: {
    label: "سپرده",
    color: "var(--chart-1)"
  },
  fee: {
    label: "ماهیانه",
    color: "var(--chart-2)"
  },
  balance: {
    label: "موجودی",
    color: "var(--primary)"
  }
} satisfies ChartConfig;

export function AccountCharts({ userId, summary }: AccountChartsProps) {
  const { data: accountsData } = useAccounts({ userId });
  const accounts = React.useMemo(() => accountsData?.data ?? [], [accountsData]);

  // --- Chart 1 Data: Total & Pie ---
  const totalStats = React.useMemo(() => {
    return summary.reduce(
      (acc, curr) => {
        acc.totalAmount += curr.totalDeposits;
        acc.regularAmount += curr.accountDeposits.amount;
        acc.feeAmount += curr.subscriptionFeeDeposits.amount;
        acc.regularCount += curr.accountDeposits.count;
        acc.feeCount += curr.subscriptionFeeDeposits.count;
        return acc;
      },
      { totalAmount: 0, regularAmount: 0, feeAmount: 0, regularCount: 0, feeCount: 0 }
    );
  }, [summary]);

  const pieData = React.useMemo(
    () => [
      {
        browser: "deposit",
        value: totalStats.regularAmount,
        fill: "var(--color-deposit)",
        count: totalStats.regularCount
      },
      { browser: "fee", value: totalStats.feeAmount, fill: "var(--color-fee)", count: totalStats.feeCount }
    ],
    [totalStats]
  );

  // --- Chart 2 Data: Bar Comparison ---
  const barData = React.useMemo(() => {
    return summary.map((item) => {
      const account = accounts.find((a) => a.id === item.accountId);
      return {
        name: account?.name ?? "نامشخص",
        balance: item.totalDeposits
      };
    });
  }, [summary, accounts]);

  if (summary.length === 0) {
    return (
      <EmptyStateCard
        title="حسابی یافت نشد"
        description="برای این کاربر هنوز هیچ حسابی تعریف نشده است."
        icon={<IdCard className="size-10 text-muted-foreground" />}
      />
    );
  }

  return (
    <Carousel className="w-full" opts={{ direction: "rtl", loop: true }}>
      <CarouselContent>
        {/* Chart 1: Overview */}
        <CarouselItem>
          <Card className="flex flex-col h-full py-6 bg-card">
            <CardHeader className="items-center pb-0">
              <CardTitle>وضعیت کلی حساب‌ها</CardTitle>
              <CardDescription>ترکیب سپرده و ماهیانه</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-62.5">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie data={pieData} dataKey="value" nameKey="browser" innerRadius={60} strokeWidth={5}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                                {totalStats.totalAmount.toLocaleString("fa-IR")}
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
                  <span className="text-muted-foreground">تعداد سپرده</span>
                  <span className="font-bold text">
                    <FormattedNumber type="normal" value={totalStats.regularCount} />
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">تعداد ماهیانه</span>
                  <span className="font-bold">
                    <FormattedNumber type="normal" value={totalStats.feeCount} />
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CarouselItem>

        {/* Chart 2: Account Comparison */}
        <CarouselItem>
          <Card className="flex flex-col h-full py-4 border-none shadow-none bg-card">
            <CardHeader className="items-center pb-0">
              <CardTitle>مقایسه حساب‌ها</CardTitle>
              <CardDescription>موجودی هر حساب</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer config={chartConfig} className="mx-auto max-h-[200px] w-full">
                <BarChart
                  accessibilityLayer
                  data={barData}
                  margin={{ top: 32, right: 12, left: 0, bottom: 6 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="balance" fill="var(--chart-1)" radius={8}>
                    <LabelList
                      dataKey="balance"
                      position="top"
                      className="fill-foreground"
                      fontSize={12}
                      formatter={(value: number) => value.toLocaleString("fa-IR")}
                    />
                  </Bar>
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
