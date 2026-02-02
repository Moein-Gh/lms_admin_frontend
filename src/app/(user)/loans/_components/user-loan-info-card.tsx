"use client";

import { Calendar, CalendarClock, DollarSign, Hash, Percent, Tag } from "lucide-react";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LoanStatus, type Loan } from "@/types/entities/loan.type";

type UserLoanInfoCardProps = {
  readonly loan: Loan;
};

function InfoItem({
  icon: Icon,
  label,
  children,
  className
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      <div className="text-sm font-medium text-foreground">{children}</div>
    </div>
  );
}

function LoanStatusBadge({ status }: { status: LoanStatus }) {
  const variant = status === LoanStatus.ACTIVE ? "default" : status === LoanStatus.PENDING ? "outline" : "secondary";
  const label = status === LoanStatus.ACTIVE ? "فعال" : status === LoanStatus.PENDING ? "در انتظار" : "بسته شده";

  return <Badge variant={variant}>{label}</Badge>;
}

function LoanSidebar({ amount, paid, paidPercentage }: { amount: string; paid: number; paidPercentage: number }) {
  return (
    <div className="md:w-80 bg-muted/10 border-t md:border-t-0 md:border-r flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1 h-full bg-linear-to-b from-primary/40 to-transparent opacity-50" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

      <div className="flex flex-col justify-between h-full gap-8">
        {/* Total Amount */}
        <div className="space-y-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>مبلغ وام</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold tracking-tight text-foreground">
              <FormattedNumber type="price" value={amount} />
            </span>
          </div>
        </div>

        {/* Balance Summary */}
        <div>
          {typeof paidPercentage === "number" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Percent className="h-3.5 w-3.5" />
                  <span>پیشرفت بازپرداخت</span>
                </div>
                <span className="font-medium text-foreground">
                  <FormattedNumber type="normal" value={Math.round(paidPercentage)} />%
                </span>
              </div>
              <Progress value={paidPercentage} className="h-1.5" />
            </div>
          )}

          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">پرداخت شده</span>
              <span className="font-medium text-primary">
                <FormattedNumber type="price" value={paid} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const addMonths = (date: Date, months: number) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

export function UserLoanInfoCard({ loan }: UserLoanInfoCardProps) {
  const start = new Date(loan.startDate);
  const months = Number.isFinite(loan.paymentMonths) ? loan.paymentMonths : 0;
  const end = months > 0 ? addMonths(start, months) : null;

  const balanceSummary = loan.balanceSummary;
  const paid = balanceSummary ? balanceSummary.repayments.amount : 0;
  const paidPercentage = balanceSummary ? balanceSummary.paidPercentage : 0;

  return (
    <Card className="overflow-hidden border-none bg-card">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-6 space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <InfoItem icon={Tag} label="نوع وام">
              {loan.loanType?.name ?? "-"}
            </InfoItem>

            <InfoItem icon={Hash} label="کد">
              <FormattedNumber type="normal" value={loan.code} />
            </InfoItem>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Tag className="h-3.5 w-3.5" />
                <span>وضعیت</span>
              </div>
              <LoanStatusBadge status={loan.status} />
            </div>

            <InfoItem icon={CalendarClock} label="مدت بازپرداخت">
              <FormattedNumber type="normal" value={months} /> ماه
            </InfoItem>

            <InfoItem icon={Calendar} label="تاریخ شروع">
              <FormattedDate value={loan.startDate} />
            </InfoItem>

            {end && (
              <InfoItem icon={Calendar} label="تاریخ پایان">
                <FormattedDate value={end} />
              </InfoItem>
            )}
          </div>
        </div>

        {/* Left Side: Balance & Amount */}
        <LoanSidebar amount={loan.amount} paid={paid} paidPercentage={paidPercentage} />
      </div>
    </Card>
  );
}
