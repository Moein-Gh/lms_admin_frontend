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
    <Card className={cn("h-full", "py-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1 md:p-4 md:pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground [&_svg]:size-4">{icon}</div>}
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5 p-3 pt-0 md:gap-2 md:p-4 md:pt-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">امروز</span>
          <span className="text-2xl font-bold tabular-nums">
            <FormattedNumber type="price" value={metric.today} />
          </span>
        </div>
        <div className="flex flex-col gap-0.5 border-t pt-1.5 md:gap-1 md:pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">ماه گذشته</span>
            <span className="text-sm font-semibold tabular-nums">
              <FormattedNumber type="price" value={metric.lastMonth} />
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">میانگین ماهانه</span>
            <span className="text-sm font-semibold tabular-nums">
              <FormattedNumber type="price" value={metric.monthlyAverage} />
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
