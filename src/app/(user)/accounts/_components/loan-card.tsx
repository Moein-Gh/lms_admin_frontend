import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Calendar, ChevronLeft } from "lucide-react";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LoanStatus, LoanStatusLabels, type Loan } from "@/types/entities/loan.type";

interface LoanCardProps {
  loan: Loan;
}

export function LoanCard({ loan }: LoanCardProps) {
  const searchParams = useSearchParams();
  const statusInfo = LoanStatusLabels[loan.status];
  const isActive = loan.status === LoanStatus.ACTIVE;
  const isPending = loan.status === LoanStatus.PENDING;

  // Preserve current tab when navigating to loan detail
  const tab = searchParams.get("tab");
  const backUrl = tab ? `/accounts?tab=${tab}` : "/accounts";

  return (
    <Link href={`/loans/${loan.id}?back=${encodeURIComponent(backUrl)}`}>
      <Card className="p-4 hover:shadow-md transition-all hover:border-primary/50 cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex flex-col gap-3">
            {/* Top Row: All Badges */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant={isActive ? "default" : isPending ? "outline" : "secondary"}
                  className={cn(
                    isActive && "bg-green-600 dark:bg-green-900 text-white",
                    isPending && "bg-amber-500 dark:bg-amber-900 text-white"
                  )}
                >
                  {statusInfo}
                </Badge>
                <Badge variant="secondary">{loan.loanType?.name ?? "نامشخص"}</Badge>
              </div>
              <Badge variant="outline">
                <FormattedNumber type="normal" value={loan.code} />
              </Badge>
            </div>
            {/* Bottom Row: Date/Months & Amount */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  <FormattedDate value={loan.createdAt} />
                </span>
                {loan.paymentMonths && (
                  <span className="flex items-center gap-1">
                    <FormattedNumber type="normal" value={loan.paymentMonths} />
                    <span>ماه</span>
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-foreground shrink-0">
                <FormattedNumber type="price" value={loan.amount} />
              </p>
            </div>
          </div>

          {/* Clickable Indicator */}
          <ChevronLeft className="size-5 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-1" />
        </div>
      </Card>
    </Link>
  );
}
