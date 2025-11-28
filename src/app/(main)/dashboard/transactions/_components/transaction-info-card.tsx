import Link from "next/link";
import { Tag, Calendar, DollarSign, ExternalLink } from "lucide-react";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import {
  TransactionKind,
  TransactionStatus,
  type Transaction,
  TRANSACTION_KIND_META,
  TRANSACTION_STATUS_BADGE
} from "@/types/entities/transaction.type";
import { TransactionApprovePanel } from "./transaction-approve-panel";
import { TransactionDeletePanel } from "./transaction-delete-panel";
import { TransactionUpdatePanel } from "./transaction-update-panel";

type TransactionInfoCardProps = {
  readonly transaction: Transaction;
  readonly onApprove?: (transaction: Transaction) => void;
};

function canApproveTransaction(transaction: Transaction): boolean {
  const { kind, status } = transaction;
  const isAllocated = status === TransactionStatus.ALLOCATED;
  const isPending = status === TransactionStatus.PENDING;

  // DEPOSIT can only be approved when ALLOCATED
  if (kind === TransactionKind.DEPOSIT) {
    return isAllocated;
  }
  if (kind === TransactionKind.LOAN_DISBURSEMENT) {
    return false;
  }

  // Other transaction types can be approved when PENDING or ALLOCATED
  return isPending || isAllocated;
}

function TransactionActionButtons({
  transaction,
  onApprove
}: {
  transaction: Transaction;
  onApprove?: (transaction: Transaction) => void;
}) {
  const canDelete =
    transaction.status === TransactionStatus.PENDING || transaction.status === TransactionStatus.ALLOCATED;

  return (
    <div className="flex flex-row gap-3 w-full items-center justify-center sm:w-auto sm:items-center">
      {canApproveTransaction(transaction) && (
        <TransactionApprovePanel transaction={transaction} onApprove={() => onApprove?.(transaction)} />
      )}

      <TransactionUpdatePanel transaction={transaction} />

      {canDelete && <TransactionDeletePanel transaction={transaction} />}
    </div>
  );
}

// Use metadata maps for labels and badge variants

export function TransactionInfoCard({ transaction, onApprove }: TransactionInfoCardProps) {
  const status = TRANSACTION_STATUS_BADGE[transaction.status];

  return (
    <Card className="overflow-hidden border-none shadow-md bg-card">
      <div className="flex flex-col md:flex-row">
        {/* Right Side: Details */}
        <div className="flex-1 p-6 space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{`تراکنش ${transaction.code}`}</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {transaction.user ? (
                  <Link
                    href={`/dashboard/users/${transaction.user.id}`}
                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <Badge variant="outline" className="hover:bg-accent">
                      {transaction.user.identity.name ?? "بدون نام"}
                    </Badge>
                  </Link>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">بدون کاربر</span>
                  </div>
                )}

                <span className="text-border">•</span>

                <div className="flex items-center gap-1.5  text-xs">
                  <Tag className="h-3 w-3" />
                  <Badge variant={TRANSACTION_KIND_META[transaction.kind].variant} className="px-2 py-0.5">
                    {TRANSACTION_KIND_META[transaction.kind].label}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="shrink-0">
                <TransactionActionButtons transaction={transaction} onApprove={onApprove} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>شناسه خارجی</span>
              </div>
              <p className="font-mono text-base font-semibold text-foreground">{transaction.externalRef ?? "-"}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>تاریخ ایجاد</span>
              </div>
              <p className="text-base font-medium text-foreground">
                <FormattedDate value={transaction.createdAt} />
              </p>
            </div>

            {transaction.note && (
              <div className="sm:col-span-2 space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Tag className="h-3.5 w-3.5" />
                  <span>توضیحات</span>
                </div>
                <div className="text-sm text-muted-foreground">{transaction.note}</div>
              </div>
            )}
          </div>
        </div>

        {/* Left Side: Amount Sidebar */}
        <div className="md:w-80 bg-muted/10 border-t md:border-t-0 md:border-r flex flex-col justify-between p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1 h-full bg-linear-to-b from-primary/40 to-transparent opacity-50" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>مبلغ تراکنش</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tracking-tight text-foreground">
                <FormattedNumber value={transaction.amount} />
              </span>
              <span className="text-lg text-muted-foreground font-medium">تومان</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground relative z-10">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>وضعیت</span>
            </div>
            <span className="font-medium">
              <Badge variant={status.variant}>{status.label}</Badge>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
