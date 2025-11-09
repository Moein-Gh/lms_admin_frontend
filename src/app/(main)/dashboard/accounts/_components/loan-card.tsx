import { Calendar, Clock, FileCheck } from "lucide-react";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Loan } from "@/types/entities/loan.type";

/**
 * Loan Card
 * Professional card with stacked detail rows
 * Name and amount in hero section, details with icons
 */
export function LoanCard({ loan }: { loan: Loan }) {
  const statusConfig = {
    ACTIVE: {
      bg: "bg-green-800/10 dark:bg-green-800/20",
      dot: "bg-green-500",
      text: "text-green-600 dark:text-green-400",
      label: "فعال"
    },
    PENDING: {
      bg: "bg-yellow-500/10 dark:bg-yellow-500/20",
      dot: "bg-yellow-500",
      text: "text-yellow-600 dark:text-yellow-400",
      label: "در انتظار"
    },
    CLOSED: {
      bg: "bg-muted",
      dot: "bg-muted-foreground",
      text: "text-muted-foreground",
      label: "بسته شده"
    }
  };

  const status = statusConfig[loan.status];

  return (
    <Card className="p-0 overflow-hidden hover:shadow-lg gap-2 transition-all duration-200">
      <div className={cn("px-3", status.bg)}>
        <div className="flex items-center justify-between gap-2 py-3">
          {/* Status badge */}
          <div
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full",
              status.bg,
              "border border-background/30"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
            <span className={cn("text-sm font-bold", status.text)}>{status.label}</span>
          </div>

          {/* Name centered */}
          <h3 className="font-bold text-base leading-tight text-center flex-1">{loan.name}</h3>

          {/* Code badge */}
          <div
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/50 backdrop-blur-sm border border-background/30"
            )}
          >
            <span className="text-sm font-bold text-muted-foreground">کد:</span>
            <span className="text-sm font-bold">{loan.code}</span>
          </div>
        </div>

        <Separator className="mb-2" />

        <div className="flex items-baseline justify-center gap-1.5 py-3">
          <span className="text-2xl sm:text-3xl font-bold tabular-nums leading-none tracking-tight">
            <FormattedNumber value={Number(loan.amount)} />
          </span>
          <span className="text-sm font-medium text-muted-foreground">تومان</span>
        </div>
      </div>

      <div className="p-3">
        <div className="grid grid-cols-1 gap-2 mb-3">
          <div className="p-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors flex items-center gap-2 border border-muted">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <Calendar className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0 flex items-center justify-between gap-1.5">
              <span className="text-sm font-semibold text-muted-foreground">تاریخ شروع</span>
              <FormattedDate value={loan.startDate} />
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors flex items-center gap-2 border border-muted">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <Clock className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0 flex items-center justify-between gap-1.5">
              <span className="text-sm font-semibold text-muted-foreground">مدت پرداخت</span>
              <span>{loan.paymentMonths} ماه</span>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors flex items-center gap-2 border border-muted">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <FileCheck className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0 flex items-center justify-between gap-1.5">
              <span className="text-sm font-semibold text-muted-foreground">تاریخ ثبت</span>
              <FormattedDate value={loan.createdAt} />
            </div>
          </div>
        </div>
        <Separator className="mb-2" />
        <Button asChild variant="outline" size="lg" className="w-full rounded-xl font-bold">
          <a href={`/dashboard/loans/${loan.id}`}>مشاهده جزئیات</a>
        </Button>
      </div>
    </Card>
  );
}
