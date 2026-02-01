import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Loan } from "@/types/entities/loan.type";

/**
 * Loan Card
 * Minimal professional card with stacked detail rows
 */
export function LoanCard({ loan }: { loan: Loan }) {
  const statusConfig = {
    ACTIVE: {
      bg: "bg-blue-500/10 dark:bg-blue-500/20",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
      label: "فعال"
    },
    PENDING: {
      bg: "bg-yellow-500/10 dark:bg-yellow-500/20",
      text: "text-yellow-600 dark:text-yellow-400",
      border: "border-yellow-200 dark:border-yellow-800",
      label: "در انتظار"
    },
    PAID: {
      bg: "bg-green-500/10 dark:bg-green-500/20",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
      label: "تسویه شده"
    }
  } as const;

  const status = statusConfig[loan.status];

  return (
    <Card className="p-4 hover:shadow-md transition-all duration-200 flex flex-col gap-4">
      {/* Header: Status & Code */}
      <div className="flex items-center justify-between">
        <div
          className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold border", status.bg, status.text, status.border)}
        >
          {status.label}
        </div>
        <span className=" text-xs font-bold text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md border border-border/50 dir-ltr">
          #{loan.code}
        </span>
      </div>

      {/* Hero: Amount & Name */}
      <div className="flex flex-col items-center justify-center py-1 gap-1">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tabular-nums">
            <FormattedNumber type="price" value={Number(loan.amount)} />
          </span>
        </div>
        <h3 className="text-sm font-medium text-muted-foreground text-center line-clamp-1">{loan.name}</h3>
      </div>

      {/* Details Grid - use divide-x so both vertical separators render consistently */}
      <div className="grid grid-cols-3 gap-2 py-3 border-t border-dashed divide-x divide-dashed divide-border/50">
        <div className="flex flex-col items-center gap-1 px-2">
          <span className="text-[10px] text-muted-foreground">شروع</span>
          <span className="text-xs font-bold">
            <FormattedDate value={loan.startDate} format="MMMM yyyy" />
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2">
          <span className="text-[10px] text-muted-foreground">مدت</span>
          <span className="text-xs font-bold">{loan.paymentMonths} ماه</span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2">
          <span className="text-[10px] text-muted-foreground">ثبت</span>
          <span className="text-xs font-bold">
            <FormattedDate value={loan.createdAt} format="MMMM yyyy" />
          </span>
        </div>
      </div>

      {/* Footer: Button */}
      <a href={`/admin/loans/${loan.id}`} className="w-full">
        <Button variant="outline" size="sm" className="w-full rounded-lg font-bold h-9">
          مشاهده جزئیات
        </Button>
      </a>
    </Card>
  );
}
