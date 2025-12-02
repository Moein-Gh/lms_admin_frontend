import { ReactNode } from "react";

import { FormattedNumber } from "@/components/formatted-number";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialMetric } from "@/lib/report-api";
import { cn } from "@/lib/utils";

interface FinancialMetricCardProps {
  metric: FinancialMetric;
  title: string;
  icon?: ReactNode;
  className?: string;
}

export function FinancialMetricCard({ metric, title, icon, className }: FinancialMetricCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-4 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">امروز</span>
          <span className="text-2xl font-bold tabular-nums">
            <FormattedNumber value={metric.today} />
          </span>
        </div>
        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-xs text-muted-foreground">ماه گذشته</span>
          <span className="text-sm font-semibold tabular-nums">
            <FormattedNumber value={metric.lastMonth} />
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">میانگین ماهانه</span>
          <span className="text-sm font-semibold tabular-nums">
            <FormattedNumber value={metric.monthlyAverage} />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
