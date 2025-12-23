"use client";

import { ArrowLeftIcon, Calendar, HandCoins } from "lucide-react";

import NoLoanCard from "@/components/entity-specific/loan/no-loan-card";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useLoans } from "@/hooks/use-loan";
import { cn, formatDate } from "@/lib/utils";
import { Loan, LoanStatus } from "@/types/entities/loan.type";

const getStatusConfig = (status: LoanStatus) => {
  if (status === LoanStatus.ACTIVE) {
    return {
      label: "فعال",
      dotClass: "bg-emerald-500",
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    };
  }
  if (status === LoanStatus.PENDING) {
    return {
      label: "در انتظار",
      dotClass: "bg-amber-500",
      badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
    };
  }
  return {
    label: "بسته شده",
    dotClass: "bg-gray-400",
    badgeClass: "bg-gray-500/10 text-gray-600 dark:text-gray-400"
  };
};

function LoanCard({ loan }: { loan: Loan }) {
  const statusConfig = getStatusConfig(loan.status);

  return (
    <div className="card-container flex flex-col">
      {/* Header: Icon + Type + Status + Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/5">
            <HandCoins className="size-5 text-primary" />
          </div>
          <Badge variant="outline" className="text-[10px] font-medium">
            {loan.loanType?.name ?? "نوع نامشخص"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn("gap-1.5 border-0 text-[10px] font-medium", statusConfig.badgeClass)}>
            <span className={cn("size-1.5 rounded-full", statusConfig.dotClass)} />
            {statusConfig.label}
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <a href={`/dashboard/loans/${loan.id}`} className="size-9 md:size-10 ">
                <Button size="icon" variant="outline" className="w-full h-full cursor-pointer">
                  <ArrowLeftIcon className="size-5" />
                </Button>
              </a>
            </TooltipTrigger>
            <TooltipContent side="top">مشاهده</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Loan Name */}
      <div className="mt-3">
        <h3 className="text-base font-semibold leading-tight">{loan.name}</h3>
      </div>

      <Separator className="my-3" />

      {/* Loan Details */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">مبلغ</span>
          <FormattedNumber type="price" value={loan.amount} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">تاریخ شروع</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 text-muted-foreground" />
            <span className="text-sm">{formatDate(loan.startDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

type UserLoansProps = {
  userId: string;
};

const UserLoans = ({ userId }: UserLoansProps) => {
  // TODO: Filter loans by user's accounts when API supports it
  const { data, isLoading } = useLoans({
    userId: userId
  });

  const loans = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-52 rounded-xl" />
        ))}
      </div>
    );
  }

  if (loans.length === 0) {
    return <NoLoanCard />;
  }

  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {loans.map((loan) => (
        <LoanCard key={loan.id} loan={loan} />
      ))}
    </div>
  );
};

export default UserLoans;
