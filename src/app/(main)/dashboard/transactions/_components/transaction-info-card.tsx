import Link from "next/link";
import { Tag, CheckCircle2, Calendar, DollarSign, ExternalLink } from "lucide-react";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { TransactionStatus, type Transaction } from "@/types/entities/transaction.type";
import { TransactionApprovePanel } from "./transaction-approve-panel";
import { TransactionDeletePanel } from "./transaction-delete-panel";
import { TransactionUpdatePanel } from "./transaction-update-panel";

type TransactionInfoCardProps = {
  readonly transaction: Transaction;
  readonly onApprove?: (transaction: Transaction) => void;
};

function TransactionActionButtons({
  transaction,
  onApprove
}: {
  transaction: Transaction;
  onApprove?: (transaction: Transaction) => void;
}) {
  return (
    <div className="flex flex-row gap-3 w-full items-center justify-center sm:w-auto sm:items-center">
      {/* Approve panel trigger shown only when transaction is pending */}
      {transaction.status === TransactionStatus.PENDING && (
        <TransactionApprovePanel transaction={transaction} onApprove={() => onApprove?.(transaction)} />
      )}

      <TransactionUpdatePanel transaction={transaction} />

      {transaction.status === TransactionStatus.PENDING && <TransactionDeletePanel transaction={transaction} />}
    </div>
  );
}

function TransactionStatusInfo({ status }: { status: Transaction["status"] }) {
  let variant: "active" | "outline" | "inactive";
  let label: string;
  switch (status) {
    case TransactionStatus.APPROVED:
      variant = "active";
      label = "تایید شده";
      break;
    case TransactionStatus.PENDING:
      variant = "outline";
      label = "در انتظار";
      break;
    case TransactionStatus.REJECTED:
      variant = "inactive";
      label = "رد شده";
      break;
    default:
      variant = "outline";
      label = "نامشخص";
  }
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

function getTransactionKindLabel(kind: Transaction["kind"]): string {
  switch (kind) {
    case "DEPOSIT":
      return "واریز";
    case "WITHDRAWAL":
      return "برداشت";
    case "LOAN_DISBURSEMENT":
      return "پرداخت وام";
    case "LOAN_REPAYMENT":
      return "بازپرداخت وام";
    case "SUBSCRIPTION_PAYMENT":
      return "پرداخت اشتراک";
    case "FEE":
      return "کارمزد";
    default:
      return kind;
  }
}

export function TransactionInfoCard({ transaction, onApprove }: TransactionInfoCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b pb-3!">
        <div className="flex flex-col items-center gap-5 sm:gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="order-1 sm:order-2 gap-2 flex flex-col items-center text-center">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <span className="text-xs text-muted-foreground">کد تراکنش:</span>
              {transaction.code}
            </CardTitle>

            <CardDescription className="flex flex-wrap items-center justify-center gap-2">
              {transaction.user ? (
                <Link href={`/dashboard/users/${transaction.user.id}`}>
                  <Badge variant="outline" className="hover:bg-accent">
                    {transaction.user.identity.name ?? "بدون نام"}
                  </Badge>
                </Link>
              ) : null}
            </CardDescription>
          </div>

          <div className="order-2 sm:order-1 flex flex-col items-center">
            <div className="inline-flex items-baseline gap-2 rounded-xl bg-accent/60 px-4 py-2 shadow-xs">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm text-muted-foreground">مبلغ تراکنش</span>
              <span className="text-xl sm:text-2xl font-extrabold leading-none">
                <FormattedNumber value={transaction.amount} />
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">تومان</span>
            </div>
            {/* Separator for mobile only */}
            <div className="block sm:hidden w-3/4 mx-auto py-2">
              <span className="block h-px bg-muted/60" />
            </div>
          </div>

          <CardAction className="order-3 sm:order-3 self-center flex flex-col items-center w-full h-full sm:w-auto sm:justify-center">
            <TransactionActionButtons transaction={transaction} onApprove={onApprove} />
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
          <TransactionStatusInfo status={transaction.status} />
          <div className="flex flex-col gap-0.5 items-center">
            <div className="flex items-center gap-1 text-base text-muted-foreground justify-center">
              <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span>نوع تراکنش</span>
            </div>
            <p className="font-medium text-xs sm:text-sm leading-tight text-center">
              {getTransactionKindLabel(transaction.kind)}
            </p>
          </div>
          <div className="flex flex-col gap-0.5 items-center">
            <div className="flex items-center gap-1 text-base text-muted-foreground justify-center">
              <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span>شناسه خارجی</span>
            </div>
            <p className="font-medium text-xs sm:text-sm leading-tight text-center font-mono">
              {transaction.externalRef ?? "-"}
            </p>
          </div>
          <div className="flex flex-col gap-0.5 items-center">
            <div className="flex items-center gap-1 text-base text-muted-foreground justify-center">
              <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span>تاریخ ایجاد</span>
            </div>
            <p className="font-medium text-xs sm:text-sm leading-tight text-center">
              <FormattedDate value={transaction.createdAt} />
            </p>
          </div>
        </div>
        {/* Description at the bottom */}
        {transaction.note && (
          <div className="mt-6 text-sm text-muted-foreground text-center border-t pt-4">{transaction.note}</div>
        )}
      </CardContent>
    </Card>
  );
}
