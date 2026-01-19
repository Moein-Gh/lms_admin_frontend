import { type ReactNode } from "react";

import { FormattedNumber } from "@/components/formatted-number";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InstallmentMetricCardProps {
  readonly title: string;
  readonly count: number;
  readonly totalAmount: string;
  readonly icon?: ReactNode;
  readonly className?: string;
}

export function InstallmentMetricCard({ title, count, totalAmount, icon, className }: InstallmentMetricCardProps) {
  return (
    <Card className={cn("h-full py-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1 md:p-4 md:pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground [&_svg]:size-4">{icon}</div>}
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5 p-3 pt-0 md:gap-2 md:p-4 md:pt-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">تعداد</span>
          <span className="text-2xl font-bold tabular-nums">
            <FormattedNumber type="normal" value={count} />
          </span>
        </div>
        <div className="flex items-center justify-between border-t pt-1.5 md:pt-2">
          <span className="text-xs text-muted-foreground">مبلغ کل</span>
          <span className="text-sm font-semibold tabular-nums">
            <FormattedNumber type="price" value={totalAmount} />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
