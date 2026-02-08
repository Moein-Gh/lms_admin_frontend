"use client";

import { ArrowDownLeft, ArrowLeftIcon, ArrowLeftRight, ArrowUpRight } from "lucide-react";

import { EmptyStateCard } from "@/components/empty-state-card";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTransactions } from "@/hooks/admin/use-transaction";
import { formatPersianDate, DATE_FORMATS } from "@/lib/date-service";
import { cn } from "@/lib/utils";
import { Transaction, TransactionKind, TransactionStatus } from "@/types/entities/transaction.type";

type UserTransactionsProps = {
  userId: string;
};

const getStatusConfig = (status: TransactionStatus) => {
  if (status === TransactionStatus.APPROVED) {
    return {
      label: "تایید شده",
      dotClass: "bg-emerald-500",
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    };
  }
  if (status === TransactionStatus.PENDING) {
    return {
      label: "در انتظار",
      dotClass: "bg-amber-500",
      badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
    };
  }
  if (status === TransactionStatus.REJECTED) {
    return {
      label: "رد شده",
      dotClass: "bg-red-500",
      badgeClass: "bg-red-500/10 text-red-600 dark:text-red-400"
    };
  }
  return {
    label: "تخصیص یافته",
    dotClass: "bg-blue-500",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
  };
};

const getKindConfig = (kind: TransactionKind): { label: string; isIncome: boolean } => {
  switch (kind) {
    case TransactionKind.DEPOSIT:
      return { label: "واریز", isIncome: true };
    case TransactionKind.WITHDRAWAL:
      return { label: "برداشت", isIncome: false };
    case TransactionKind.LOAN_DISBURSEMENT:
      return { label: "پرداخت وام", isIncome: false };
    case TransactionKind.TRANSFER:
      return { label: "انتقال", isIncome: false };
    default:
      return { label: "نامشخص", isIncome: false };
  }
};

function TransactionCard({ transaction }: { transaction: Transaction }) {
  const statusConfig = getStatusConfig(transaction.status);
  const kindConfig = getKindConfig(transaction.kind);

  return (
    <div className="card-container flex flex-col">
      {/* Header: Icon + Type + Status + Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-lg",
              kindConfig.isIncome ? "bg-emerald-500/10" : "bg-red-500/10"
            )}
          >
            {kindConfig.isIncome ? (
              <ArrowDownLeft className="size-5 text-emerald-600" />
            ) : (
              <ArrowUpRight className="size-5 text-red-600" />
            )}
          </div>
          <Badge variant="outline" className="text-[10px] font-medium">
            {kindConfig.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn("gap-1.5 border-0 text-[10px] font-medium", statusConfig.badgeClass)}>
            <span className={cn("size-1.5 rounded-full", statusConfig.dotClass)} />
            {statusConfig.label}
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <a href={`/admin/transactions/${transaction.id}`}>
                <Button size="icon" variant="outline" className="size-9 md:size-10 cursor-pointer">
                  <ArrowLeftIcon className="size-5" />
                </Button>
              </a>
            </TooltipTrigger>
            <TooltipContent side="top">مشاهده</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Transaction Amount */}
      <div className="mt-3">
        <p className={cn("text-lg font-bold", kindConfig.isIncome ? "text-emerald-600" : "text-red-600")}>
          {kindConfig.isIncome ? "+" : "-"}
          <FormattedNumber type="price" value={transaction.amount} />
        </p>
      </div>

      <Separator className="my-3" />

      {/* Transaction Details */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">کد تراکنش</span>
          <span className=" text-sm">{transaction.code}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">شناسه خارجی</span>
          <span className="text-sm">{transaction.externalRef ?? "—"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">تاریخ</span>
          <span className="text-sm">{formatPersianDate(transaction.createdAt, DATE_FORMATS.SHORT)}</span>
        </div>
      </div>
    </div>
  );
}

const UserTransactions = ({ userId }: UserTransactionsProps) => {
  const { data, isLoading } = useTransactions({ userId });

  const transactions = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-52 rounded-xl" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyStateCard
        title="تراکنشی یافت نشد"
        description="برای این کاربر هنوز هیچ تراکنشی تعریف نشده است."
        icon={<ArrowLeftRight className="size-10 text-muted-foreground" />}
      />
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {transactions.map((transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
};

export default UserTransactions;
