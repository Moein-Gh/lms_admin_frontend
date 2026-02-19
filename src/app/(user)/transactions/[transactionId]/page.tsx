"use client";

import { useParams, useRouter } from "next/navigation";
import { CalendarIcon, Clock, ExternalLink, ReceiptText } from "lucide-react";
import { TransactionAllocationSummary } from "@/app/(admin)/admin/transactions/_components/transaction-allocation-summary";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { TransactionIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUserTransaction } from "@/hooks/user/use-transaction";
import {
  TransactionKind,
  TransactionStatus,
  TRANSACTION_KIND_META,
  TRANSACTION_STATUS_BADGE
} from "@/types/entities/transaction.type";
import { PageHeader } from "../../_components/page-header";

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

export default function UserTransactionDetailPage() {
  const { transactionId } = useParams();
  const router = useRouter();
  const { data: transaction, isLoading, error } = useUserTransaction(transactionId as string);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-4 sm:p-6">
        <div className="h-96 rounded-lg border bg-card animate-pulse" />
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="container max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-center space-y-4">
          <p className="text-lg text-destructive">خطا در بارگذاری اطلاعات تراکنش</p>
          <Button onClick={() => router.back()} variant="outline">
            بازگشت
          </Button>
        </div>
      </div>
    );
  }

  const kindMeta = TRANSACTION_KIND_META[transaction.kind];
  const statusMeta = TRANSACTION_STATUS_BADGE[transaction.status];
  const bannerBg = STATUS_BANNER_BG[transaction.status];

  const isApprovedDeposit =
    transaction.kind === TransactionKind.DEPOSIT && transaction.status === TransactionStatus.APPROVED;

  const headerTitle = (
    <>
      تراکنش <FormattedNumber type="normal" value={transaction.code} />
    </>
  );

  return (
    <div className="container max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      <PageHeader icon={TransactionIcon} title={headerTitle} showBackButton={true} />

      {/* ── Payslip card ── */}
      <Card className="overflow-hidden border shadow-sm bg-card py-0 gap-0">
        {/* Banner */}
        <div className={`${bannerBg} px-5 pt-5 pb-5`}>
          {/* Row 1: amount label · status badge */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-muted-foreground">مبلغ تراکنش</span>
            <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
          </div>

          {/* Row 2: amount hero */}
          <p className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-none mb-4">
            <FormattedNumber type="price" value={transaction.amount} />
          </p>

          {/* Row 3: code · kind */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground font-mono">{`#${transaction.code}`}</span>
            <span className="text-border text-xs">·</span>
            <Badge variant={kindMeta.variant}>{kindMeta.label}</Badge>
          </div>
        </div>

        {/* Dashed tear-off divider */}
        <div className="relative flex items-center px-0">
          <div className="absolute -right-4 w-8 h-8 rounded-full bg-background border border-border" />
          <div className="absolute -left-4 w-8 h-8 rounded-full bg-background border border-border" />
          <div className="w-full border-t-2 border-dashed border-border/70 mx-4" />
        </div>

        {/* Detail rows */}
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

          {transaction.note && (
            <div className="py-3 border-b border-dashed border-border/60 space-y-1.5">
              <p className="text-xs text-muted-foreground">توضیحات</p>
              <p className="text-sm text-foreground font-medium leading-relaxed">{transaction.note}</p>
            </div>
          )}
        </div>
      </Card>

      {/* ── Allocation summary (deposit + approved only) ── */}
      {isApprovedDeposit && (
        <Card className="overflow-hidden py-0 gap-0">
          <CardHeader className="flex flex-row items-center gap-3 p-4 border-b">
            <ReceiptText className="size-4 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">نحوه تخصیص وجه</p>
          </CardHeader>
          <CardContent className="p-4">
            <TransactionAllocationSummary transactionId={transaction.id} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
