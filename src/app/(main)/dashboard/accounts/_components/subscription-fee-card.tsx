import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  SUBSCRIPTION_FEE_STATUS_LABEL,
  SubscriptionFeeStatus,
  type SubscriptionFee
} from "@/types/entities/subscription-fee.type";

export function SubscriptionFeeCard({ fee }: { fee: SubscriptionFee }) {
  const statusConfig = {
    DUE: {
      bg: "bg-yellow-500/10 dark:bg-yellow-500/20",
      text: "text-yellow-600 dark:text-yellow-400",
      border: "border-yellow-200 dark:border-yellow-800"
    },
    PAID: {
      bg: "bg-green-500/10 dark:bg-green-500/20",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-800"
    },
    ALLOCATED: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      border: "border-border"
    }
  } as const;

  const status = statusConfig[fee.status];

  const dateValue =
    fee.status === SubscriptionFeeStatus.DUE
      ? (fee.dueDate ?? fee.periodStart)
      : fee.status === SubscriptionFeeStatus.PAID
        ? (fee.paidAt ?? fee.updatedAt)
        : fee.createdAt;

  return (
    <Card className="p-4 hover:shadow-md transition-all duration-200 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div
          className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold border", status.bg, status.text, status.border)}
        >
          {SUBSCRIPTION_FEE_STATUS_LABEL[fee.status]}
        </div>
        <span className=" text-xs font-bold text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md border border-border/50 dir-ltr">
          #{fee.code}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-1">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tabular-nums">
            <FormattedNumber type="price" value={Number(fee.amount)} />
          </span>
        </div>
      </div>

      <div className="text-center border-t pt-3 border-dashed">
        <span className="text-sm font-medium text-muted-foreground">
          <FormattedDate value={dateValue} />
        </span>
      </div>
    </Card>
  );
}
