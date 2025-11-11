import { Calendar, CircleCheck, CircleDashed, Clock } from "lucide-react";

import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Installment, InstallmentStatus } from "@/types/entities/installment.type";

export function InstallmentCard({ installment }: { installment: Installment }) {
  const statusConfig = {
    [InstallmentStatus.PAID]: {
      label: "پرداخت شده",
      variant: "active" as const,
      icon: CircleCheck,
      color: "text-green-600 dark:text-green-500"
    },
    [InstallmentStatus.ACTIVE]: {
      label: "فعال",
      variant: "default" as const,
      icon: Clock,
      color: "text-blue-600 dark:text-blue-500"
    },
    [InstallmentStatus.PENDING]: {
      label: "در انتظار",
      variant: "inactive" as const,
      icon: CircleDashed,
      color: "text-orange-600 dark:text-orange-500"
    }
  };

  const status = statusConfig[installment.status];
  const StatusIcon = status.icon;

  return (
    <Card className="@container/installment-card py-1 transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Timeline indicator: hidden on mobile, visible at container >=400px */}
          <div className="hidden @[400px]/installment-card:flex flex-col items-center gap-1 shrink-0">
            <div className={cn("rounded-full bg-muted p-2", status.color)}>
              <StatusIcon className="size-4" />
            </div>
            <div className="h-full min-h-8 w-0.5 bg-border @[400px]/installment-card:block hidden" />
          </div>

          {/* Content: use a flex row so amount stays on the same line on narrow screens */}
          <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
            {/* Main info */}
            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm">
                  قسط شماره <FormattedNumber value={installment.installmentNumber} />
                </h3>
                <Badge variant={status.variant} className="gap-1">
                  {status.label}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  <span>سررسید:</span>
                  <FormattedDate value={installment.dueDate} className="font-medium tabular-nums" />
                </div>
                {installment.paymentDate && (
                  <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500">
                    <CircleCheck className="size-3.5" />
                    <FormattedDate value={installment.paymentDate} className="font-medium tabular-nums" />
                  </div>
                )}
              </div>
            </div>

            {/* Amount */}
            <div className="shrink-0 text-left @[400px]/installment-card:text-right">
              <div className="inline-flex flex-col gap-0.5 items-end @[400px]/installment-card:items-end">
                <span className="text-[10px] text-muted-foreground">مبلغ قسط</span>
                <div className="font-bold text-lg tabular-nums">
                  <FormattedNumber value={installment.amount} />
                  <span className="text-xs text-muted-foreground mr-1">تومان</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
