import Link from "next/link";
import { Building2, Calendar, CalendarClock, CheckCircle2, DollarSign, Hash, Percent, Tag, User } from "lucide-react";

import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { LoanBalanceSummary } from "@/types/entities/loan-balane.type";
import { LoanStatus, type Loan } from "@/types/entities/loan.type";

import { LoanApprovePanel } from "./loan-approve-panel";
import { LoanDeletePanel } from "./loan-delete-panel";
import { LoanUpdatePanel } from "./loan-update-panel";

type LoanInfoCardProps = {
  readonly loan: Loan;
  readonly onApprove?: (loan: Loan) => void;
};

function LoanActionButtons({ loan, onApprove }: { loan: Loan; onApprove?: (loan: Loan) => void }) {
  return (
    <div className="flex items-center gap-1">
      {/* Approve panel trigger shown only when loan is pending */}
      {loan.status === LoanStatus.PENDING && <LoanApprovePanel loan={loan} onApprove={() => onApprove?.(loan)} />}

      <LoanUpdatePanel loan={loan} />

      {loan.status === LoanStatus.PENDING && <LoanDeletePanel loan={loan} />}
    </div>
  );
}

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

function LoanSidebar({ amount, balanceSummary }: { amount: string; balanceSummary?: LoanBalanceSummary }) {
  const paid = balanceSummary ? balanceSummary.repayments.amount : 0;
  const paidCount = balanceSummary ? balanceSummary.repayments.count : 0;
  const paidPercentage = balanceSummary ? balanceSummary.paidPercentage : 0;

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
        {balanceSummary && (
          <div className="">
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

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">پرداخت شده</span>
                <span className="font-medium text-primary">
                  <FormattedNumber type="price" value={paid} />
                </span>
              </div>
              <div className="text-xs text-muted-foreground text-end">
                <FormattedNumber type="normal" value={paidCount} /> قسط
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const addMonths = (date: Date, months: number) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

export function LoanInfoCard({ loan, onApprove }: LoanInfoCardProps) {
  const start = new Date(loan.startDate);
  const months = Number.isFinite(loan.paymentMonths) ? loan.paymentMonths : 0;
  const end = months > 0 ? addMonths(start, months) : null;

  const balanceSummary = loan.balanceSummary;

  return (
    <Card className="overflow-hidden border-none shadow-md bg-card">
      <div className="flex flex-col md:flex-row">
        {/* Right Side: Loan Details */}
        <div className="flex-1 p-6 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground line-clamp-2">
                {loan.name || "وام بدون عنوان"}
              </h2>
              <div className="shrink-0">
                <LoanActionButtons loan={loan} onApprove={onApprove} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <InfoItem icon={Building2} label="حساب">
              {loan.account?.name ?? "-"}
            </InfoItem>

            <InfoItem icon={User} label="کاربر">
              {loan.account?.user ? (
                <Link href={`/admin/users/${loan.account.user.id}`} className="hover:text-primary transition-colors">
                  {loan.account.user.identity.name}
                </Link>
              ) : (
                "بدون کاربر"
              )}
            </InfoItem>

            <InfoItem icon={Tag} label="نوع وام">
              {loan.loanType?.name ?? "-"}
            </InfoItem>

            <InfoItem icon={Hash} label="کد">
              <FormattedNumber type="normal" value={loan.code} />
            </InfoItem>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5" />
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
        <LoanSidebar amount={loan.amount} balanceSummary={balanceSummary} />
      </div>
    </Card>
  );
}
