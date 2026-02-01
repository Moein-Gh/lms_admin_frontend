import Link from "next/link";
import { Calendar, ChevronLeft, Clock, CheckCircle2 } from "lucide-react";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type Loan } from "@/types/entities/loan.type";

interface ActiveLoanCardProps {
  loan: Loan;
  href?: string;
}

export function ActiveLoanCard({ loan, href }: ActiveLoanCardProps) {
  const paidPercentage = loan.balanceSummary?.paidPercentage ?? 0;
  const remaining = loan.balanceSummary?.outstandingBalance ?? loan.amount;
  const paid = loan.balanceSummary?.repayments.amount ?? 0;

  // Installment summary data
  const installmentSummary = loan.installmentSummary;
  const nextInstallment = installmentSummary?.nextInstallmentDate;
  const nextAmount = installmentSummary?.nextInstallmentAmount;
  const overdueCount = installmentSummary?.overdueCount ?? 0;
  const paidInstallments = installmentSummary?.paidCount ?? 0;
  const totalInstallments = installmentSummary?.totalCount ?? loan.paymentMonths;

  // Calculate percentages based on installment counts
  const paidInstallmentPercentage = totalInstallments > 0 ? (paidInstallments / totalInstallments) * 100 : 0;
  const overduePercentage = totalInstallments > 0 ? (overdueCount / totalInstallments) * 100 : 0;

  const CardWrapper = href ? Link : "div";

  return (
    <CardWrapper href={href ?? ""}>
      <Card className={cn("p-4 transition-all", href && "hover:shadow-md hover:border-primary/50 cursor-pointer")}>
        <div className="flex flex-col gap-4">
          {/* Top Row: Loan Info */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg truncate">{loan.name || "وام"}</h3>
                <Badge variant="secondary" className="shrink-0">
                  {loan.loanType?.name ?? "نامشخص"}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {loan.account?.name && (
                  <span className="flex items-center gap-1">
                    <span className="font-medium">حساب:</span>
                    <FormattedNumber type="normal" value={loan.account.name} />
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  <FormattedDate value={loan.startDate} />
                </span>
                {totalInstallments && (
                  <span className="flex items-center gap-1">
                    <FormattedNumber type="normal" value={totalInstallments} />
                    <span>قسط</span>
                  </span>
                )}
              </div>
            </div>
            {href && <ChevronLeft className="size-5 text-muted-foreground shrink-0" />}
          </div>

          {/* Next Installment Info */}
          {nextInstallment && nextAmount && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-xs text-muted-foreground">قسط بعدی</p>
                  <p className="text-sm font-medium">
                    <FormattedDate value={nextInstallment} />
                  </p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">
                  <FormattedNumber type="price" value={nextAmount} />
                </p>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">پیشرفت بازپرداخت</span>
              <div className="flex items-center gap-2">
                {overdueCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {overdueCount} عقب‌افتاده
                  </Badge>
                )}
                <span className="font-medium">
                  <FormattedNumber type="normal" value={Math.round(paidPercentage)} />%
                </span>
              </div>
            </div>

            {/* Three-section Progress Bar */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-loan-future">
              {/* Paid installments (green) */}
              <div
                className="absolute h-full bg-loan-paid transition-all"
                style={{ width: `${paidInstallmentPercentage}%` }}
              />

              {/* Overdue installments (red) - positioned after paid */}
              {overdueCount > 0 && (
                <div
                  className="absolute h-full bg-loan-overdue transition-all"
                  style={{
                    left: `${paidInstallmentPercentage}%`,
                    width: `${overduePercentage}%`
                  }}
                />
              )}
            </div>

            {/* Progress Legend */}
            <div className="flex items-center gap-4 text-xs flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-loan-paid" />
                <span className="text-muted-foreground">
                  پرداخت شده: <FormattedNumber type="normal" value={paidInstallments} />
                </span>
              </div>
              {overdueCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-loan-overdue" />
                  <span className="text-muted-foreground">
                    عقب‌افتاده: <FormattedNumber type="normal" value={overdueCount} />
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-loan-future" />
                <span className="text-muted-foreground">
                  آینده:{" "}
                  <FormattedNumber type="normal" value={totalInstallments - paidInstallments - overdueCount} />{" "}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Amounts */}
          <div className="flex items-center justify-between gap-4 pt-2 border-t">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">پرداخت شده</p>
              <p className="text-sm font-bold text-green-600 dark:text-green-400">
                <FormattedNumber type="price" value={paid} />
              </p>
            </div>
            <div className="space-y-1 text-left">
              <p className="text-xs text-muted-foreground">باقیمانده</p>
              <p className="text-lg font-bold text-foreground">
                <FormattedNumber type="price" value={remaining} />
              </p>
            </div>
          </div>
        </div>
      </Card>
    </CardWrapper>
  );
}
