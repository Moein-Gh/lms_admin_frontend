"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { MonthlyPaymentDto } from "@/types/entities/payment.type";

const chartConfig = {
  total: {
    label: "کل",
    color: "var(--chart-1)"
  },
  paid: {
    label: "پرداخت شده",
    color: "var(--chart-2)"
  },
  unpaid: {
    label: "پرداخت نشده",
    color: "var(--chart-3)"
  }
} satisfies ChartConfig;

type PaymentChartProps = {
  upcomingMonths: MonthlyPaymentDto[];
  pastMonths: MonthlyPaymentDto[];
};

export function PaymentChart({ upcomingMonths, pastMonths }: PaymentChartProps) {
  const allMonths = [...pastMonths, ...upcomingMonths];

  const chartData = allMonths.map((month) => ({
    month: month.monthName.split(" ")[0], // Just month name
    total: Number(month.total),
    paid: Number(month.totalPaid),
    unpaid: Number(month.totalUnpaid)
  }));

  // Limit to last 6 months
  const displayData = chartData.slice(-6);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg">روند پرداخت‌ها</CardTitle>
        <CardDescription className="text-xs sm:text-sm">مقایسه پرداخت‌های انجام شده و باقیمانده</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="h-48 sm:h-56 w-full">
          <BarChart accessibilityLayer data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="month" tickLine={false} tickMargin={8} axisLine={false} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="paid" stackId="a" fill="var(--chart-2)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="unpaid" stackId="a" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
