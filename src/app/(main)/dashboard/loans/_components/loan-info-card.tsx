import Link from "next/link";
import { Building2, Tag, CheckCircle2, Calendar, DollarSign, CalendarClock } from "lucide-react";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Loan } from "@/types/entities/loan.type";

type LoanInfoCardProps = {
  readonly loan: Loan;
};

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
      <Badge variant={variant} className="w-fit text-base py-0 leading-tight mx-auto">
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

export function LoanInfoCard({ loan }: LoanInfoCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-3 sm:p-4 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold">{loan.name}</h2>
          <p className="text-sm text-muted-foreground">
            کد وام: <FormattedNumber value={loan.code} />
          </p>
        </div>
        {loan.account?.user ? (
          <Link href={`/dashboard/users/${loan.account.user.id}`}>
            <Badge variant="outline" className="hover:bg-accent">
              {loan.account.user.identity.name ?? "بدون نام"}
            </Badge>
          </Link>
        ) : null}
      </div>
      <Separator />
      <div className="px-3 sm:px-4 pt-1 pb-0 grid grid-cols-2 sm:grid-cols-4 gap-x-2 gap-y-2 sm:gap-x-3 sm:gap-y-2 justify-items-center">
        <LoanAccountInfo account={loan.account} />
        <LoanTypeInfo loanType={loan.loanType} />
        <LoanStatusInfo status={loan.status} />
        <LoanStartDateInfo startDate={loan.startDate} />
      </div>
    </Card>
  );
}
