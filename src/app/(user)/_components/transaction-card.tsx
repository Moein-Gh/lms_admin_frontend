import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowLeftRight, CreditCard, ChevronLeft } from "lucide-react";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DATE_FORMATS } from "@/lib/date-service";
import {
  Transaction,
  TransactionKind,
  TRANSACTION_KIND_META,
  TRANSACTION_STATUS_BADGE
} from "@/types/entities/transaction.type";

type TransactionCardProps = {
  readonly transaction: Transaction;
  readonly showViewButton?: boolean;
};

function getTransactionIcon(kind: TransactionKind) {
  switch (kind) {
    case TransactionKind.DEPOSIT:
      return <ArrowDown className="size-5 text-success" />;
    case TransactionKind.WITHDRAWAL:
      return <ArrowUp className="size-5 text-destructive" />;
    case TransactionKind.TRANSFER:
      return <ArrowLeftRight className="size-5 text-warning" />;
    case TransactionKind.LOAN_DISBURSEMENT:
      return <CreditCard className="size-5 " />;
  }
}

export function TransactionCard({ transaction, showViewButton = true }: TransactionCardProps) {
  const kindMeta = TRANSACTION_KIND_META[transaction.kind];
  const statusMeta = TRANSACTION_STATUS_BADGE[transaction.status];

  return (
    <Card className="overflow-hidden border bg-card ">
      <Link href={`/transactions/${transaction.id}`} className="block p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Right: Icon and Details */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="shrink-0 flex items-center justify-center size-10 rounded-full bg-muted">
              {getTransactionIcon(transaction.kind)}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-sm">{kindMeta.label}</p>
                <Badge variant={kindMeta.variant} className="text-xs">
                  کد <FormattedNumber type="normal" value={String(transaction.code)} />
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FormattedDate value={transaction.createdAt} format={DATE_FORMATS.SHORT_WITH_TIME} />
              </div>
            </div>
          </div>

          {/* Left: Amount and Arrow */}
          <div className="flex items-center gap-2 shrink-0">
            <FormattedNumber
              type="price"
              value={transaction.amount}
              className={`text-sm font-bold ${
                transaction.kind === TransactionKind.DEPOSIT ? "text-success" : "text-foreground"
              }`}
            />
            {showViewButton && <ChevronLeft className="size-4 text-muted-foreground" />}
          </div>
        </div>

        {transaction.note && (
          <div className="mt-3 pt-3 border-t flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground line-clamp-1 flex-1">{transaction.note}</p>
            <Badge variant={statusMeta.variant} className="text-xs px-2 py-0 shrink-0">
              {statusMeta.label}
            </Badge>
          </div>
        )}

        {!transaction.note && (
          <div className="mt-3 pt-3 border-t flex items-center justify-end">
            <Badge variant={statusMeta.variant} className="text-xs px-2 py-0">
              {statusMeta.label}
            </Badge>
          </div>
        )}
      </Link>
    </Card>
  );
}
