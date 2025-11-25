import Link from "next/link";
import { Building2, Tag, CheckCircle2, Calendar, DollarSign, CalendarClock } from "lucide-react";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
    <div className="flex flex-row gap-3 w-full items-center justify-center sm:w-auto sm:items-center">
      {/* Approve panel trigger shown only when loan is pending */}
      {loan.status === LoanStatus.PENDING && <LoanApprovePanel loan={loan} onApprove={() => onApprove?.(loan)} />}

      <LoanUpdatePanel loan={loan} />

      {loan.status === LoanStatus.PENDING && <LoanDeletePanel loan={loan} />}
    </div>
  );
}

function LoanAccountInfo({ account }: { account: Loan["account"] }) {
  return (
    <div className="flex flex-col gap-0.5 items-center">
      <div className="flex items-center gap-1 text-base text-muted-foreground justify-center">
        <Building2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        <span>حساب</span>
      </div>
      <p className="font-medium text-xs sm:text-sm leading-tight text-center">{account?.name ?? "-"}</p>
    </div>
  );
}

function LoanTypeInfo({ loanType }: { loanType: Loan["loanType"] }) {
  return (
    <div className="flex flex-col gap-0.5 items-center">
      <div className="flex items-center gap-1 text-base text-muted-foreground justify-center">
        <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        <span>نوع وام</span>
      </div>
      <p className="font-medium text-xs sm:text-sm leading-tight text-center">{loanType?.name ?? "-"}</p>
    </div>
  );
}

function LoanStatusInfo({ status }: { status: Loan["status"] }) {
  const variant = status === "ACTIVE" ? "active" : status === "PENDING" ? "outline" : "inactive";
  const label = status === "ACTIVE" ? "فعال" : status === "PENDING" ? "در انتظار" : "بسته شده";
  return (
    <div className="flex flex-col gap-0.5 items-center">
      <div className="flex items-center gap-1 text-base text-muted-foreground justify-center">
        <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        <span>وضعیت</span>
      </div>
      <Badge variant={variant} className="w-fit py-0 leading-tight mx-auto">
        {label}
      </Badge>
    </div>
  );
}

function LoanStartDateInfo({ startDate }: { startDate: Loan["startDate"] }) {
  return (
    <div className="flex flex-col gap-0.5 items-center">
      <div className="flex items-center gap-1 text-base text-muted-foreground justify-center">
        <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        <span>تاریخ شروع</span>
      </div>
      <p className="font-medium text-base leading-tight text-center">
        <FormattedDate value={startDate} />
      </p>
    </div>
  );
}

export function LoanInfoCard({ loan, onApprove }: LoanInfoCardProps) {
  // helpers
  const addMonths = (date: Date, months: number) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  };

  const start = new Date(loan.startDate);
  const months = Number.isFinite(loan.paymentMonths) ? loan.paymentMonths : 0;
  const end = months > 0 ? addMonths(start, months) : null;
  const now = new Date();
  const progress =
    end && end > start
      ? Math.min(100, Math.max(0, ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100))
      : 0;
  const amount = loan.amount;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b pb-3!">
        <div className="flex  flex-col items-center gap-5 sm:gap-4 sm:flex-row sm:justify-between sm:items-center">
          {/* Title & meta centered, always first on mobile */}
          <div className="order-1 sm:order-2 gap-2 flex flex-col items-center text-center">
            <CardTitle className="text-lg sm:text-xl leading-tight">{loan.name}</CardTitle>
            <CardDescription className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-muted-foreground">کد وام:</span>
              <FormattedNumber value={loan.code} />
              {loan.account?.user ? (
                <Link href={`/dashboard/users/${loan.account.user.id}`}>
                  <Badge variant="outline" className="hover:bg-accent">
                    {loan.account.user.identity.name ?? "بدون نام"}
                  </Badge>
                </Link>
              ) : null}
            </CardDescription>
          </div>

          {/* Amount highlight, always second on mobile */}
          <div className="order-2 sm:order-1 flex flex-col items-center">
            <div className="inline-flex items-baseline gap-2 rounded-xl bg-accent/60 px-4 py-2 shadow-xs">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm text-muted-foreground">مبلغ وام</span>
              <span className="text-xl sm:text-2xl font-extrabold leading-none">
                <FormattedNumber value={amount} />
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">تومان</span>
            </div>
            {/* Separator for mobile only */}
            <div className="block sm:hidden w-3/4 mx-auto py-2">
              <span className="block h-px bg-muted/60" />
            </div>
          </div>

          {/* Actions, always third on mobile */}
          <CardAction className="order-3 sm:order-3 self-center flex flex-col items-center w-full h-full sm:w-auto sm:justify-center">
            <LoanActionButtons loan={loan} onApprove={onApprove} />
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="py-4">
        {/* Top info grid (without amount now) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
          <LoanAccountInfo account={loan.account} />
          <LoanTypeInfo loanType={loan.loanType} />
          <LoanStatusInfo status={loan.status} />
        </div>

        {/* Dates row */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          <LoanStartDateInfo startDate={loan.startDate} />
          <div className="flex flex-col gap-0.5 items-center">
            <div className="flex items-center gap-1 text-base text-muted-foreground justify-center">
              <CalendarClock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span>مدت بازپرداخت</span>
            </div>
            <p className="font-medium text-xs sm:text-sm leading-tight text-center">
              <FormattedNumber value={months} />
              <span className="ms-1">ماه</span>
            </p>
          </div>
          {end ? (
            <div className="flex flex-col gap-0.5 items-center">
              <div className="flex items-center gap-1 text-base text-muted-foreground justify-center">
                <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span>تاریخ پایان</span>
              </div>
              <p className="font-medium text-xs sm:text-sm leading-tight text-center">
                <FormattedDate value={end} />
              </p>
            </div>
          ) : null}
        </div>

        {/* Progress */}
        {end ? (
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
              <span>پیشرفت بازپرداخت</span>
              <span>
                <FormattedNumber value={Math.round(progress)} />%
              </span>
            </div>
            <Progress value={progress} aria-label="پیشرفت بازپرداخت وام" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
