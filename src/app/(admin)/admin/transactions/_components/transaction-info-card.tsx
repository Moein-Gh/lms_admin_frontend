import Link from "next/link";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { CalendarIcon, Clock, ExternalLink, UserIcon } from "@/components/icons";
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
import { TransactionImage } from "./transaction-image";
import { TransactionRejectPanel } from "./transaction-reject-panel";
import { TransactionUpdatePanel } from "./transaction-update-panel";

type TransactionInfoCardProps = {
  readonly transaction: Transaction;
  readonly onApprove?: (transaction: Transaction) => void;
};

function canApproveTransaction(transaction: Transaction): boolean {
  const { kind, status } = transaction;
  const isAllocated = status === TransactionStatus.ALLOCATED;
  const isPending = status === TransactionStatus.PENDING;
  if (kind === TransactionKind.DEPOSIT) return isAllocated;
  if (kind === TransactionKind.LOAN_DISBURSEMENT) return false;
  return isPending || isAllocated;
}

/** Subtle tinted banner backgrounds per status */
const STATUS_BANNER_BG: Record<TransactionStatus, string> = {
  [TransactionStatus.APPROVED]: "bg-green-500/8 dark:bg-green-500/10",
  [TransactionStatus.PENDING]: "bg-muted/60",
  [TransactionStatus.REJECTED]: "bg-destructive/8 dark:bg-destructive/10",
  [TransactionStatus.ALLOCATED]: "bg-primary/8 dark:bg-primary/10"
};

type DetailRowProps = {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly value: React.ReactNode;
};

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-dashed border-border/60 last:border-0">
      <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
        <span className="[&>svg]:size-3.5 text-muted-foreground/70">{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-sm font-medium text-foreground text-end min-w-0">{value}</div>
    </div>
  );
}

export function TransactionInfoCard({ transaction, onApprove }: TransactionInfoCardProps) {
  const statusMeta = TRANSACTION_STATUS_BADGE[transaction.status];
  const kindMeta = TRANSACTION_KIND_META[transaction.kind];
  const bannerBg = STATUS_BANNER_BG[transaction.status];

  const canDelete =
    transaction.status === TransactionStatus.PENDING || transaction.status === TransactionStatus.ALLOCATED;
  const canReject =
    transaction.status === TransactionStatus.PENDING || transaction.status === TransactionStatus.ALLOCATED;
  const canApprove = canApproveTransaction(transaction);

  return (
    <Card className="overflow-hidden border shadow-sm bg-card py-0 gap-0">
      {/* ── Banner ── */}
      <div className={`${bannerBg} px-5 pt-5 pb-5`}>
        {/* Row 1: amount label left · status badge right */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs text-muted-foreground">مبلغ تراکنش</span>
          <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
        </div>

        {/* Row 2: amount hero */}
        <p className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-none mb-4">
          <FormattedNumber type="price" value={transaction.amount} />
        </p>

        {/* Row 3: metadata — code · kind · user */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-mono">{`#${transaction.code}`}</span>
          <span className="text-border text-xs">·</span>
          <Badge variant={kindMeta.variant}>{kindMeta.label}</Badge>
          {transaction.user && (
            <>
              <span className="text-border text-xs">·</span>
              <Link
                href={`/admin/users/${transaction.user.id}`}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <UserIcon className="h-3 w-3 shrink-0" />
                <span>{transaction.user.identity.name ?? "بدون نام"}</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Dashed tear-off divider ── */}
      <div className="relative flex items-center px-0">
        {/* Left notch */}
        <div className="absolute -right-4 w-8 h-8 rounded-full bg-background border border-border" />
        {/* Right notch */}
        <div className="absolute -left-4 w-8 h-8 rounded-full bg-background border border-border" />
        {/* Dashed line */}
        <div className="w-full border-t-2 border-dashed border-border/70 mx-4" />
      </div>

      {/* ── Detail rows ── */}
      <div className="px-5 pt-4 pb-2">
        <DetailRow
          icon={<CalendarIcon />}
          label="تاریخ ایجاد"
          value={<FormattedDate value={transaction.createdAt} />}
        />
        <DetailRow icon={<Clock />} label="آخرین بروزرسانی" value={<FormattedDate value={transaction.updatedAt} />} />
        <DetailRow
          icon={<ExternalLink />}
          label="شناسه خارجی"
          value={
            transaction.externalRef ? (
              <span className="font-mono text-xs">{transaction.externalRef}</span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )
          }
        />

        {/* Note — inline row when short, block when present */}
        {transaction.note && (
          <div className="py-3 border-b border-dashed border-border/60 space-y-1.5">
            <p className="text-xs text-muted-foreground">توضیحات</p>
            <p className="text-sm text-foreground font-medium leading-relaxed">{transaction.note}</p>
          </div>
        )}

        {/* Images */}
        {transaction.images.length > 0 && (
          <div className="py-3 border-b border-dashed border-border/60">
            <TransactionImage images={transaction.images} transaction={transaction} />
          </div>
        )}
      </div>

      {/* ── Action bar ── */}
      <div className="px-4 py-3 border-t bg-muted/30">
        <div className="flex flex-wrap gap-2">
          {canApprove && (
            <div className="flex-1 min-w-32 [&>button]:w-full">
              <TransactionApprovePanel transaction={transaction} onApprove={() => onApprove?.(transaction)} />
            </div>
          )}
          {canReject && (
            <div className="flex-1 min-w-28 [&>button]:w-full">
              <TransactionRejectPanel transaction={transaction} />
            </div>
          )}
          <div className="flex-1 min-w-28 [&>button]:w-full">
            <TransactionUpdatePanel transaction={transaction} />
          </div>
          {canDelete && (
            <div className="flex-1 min-w-20 [&>button]:w-full">
              <TransactionDeletePanel transaction={transaction} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
