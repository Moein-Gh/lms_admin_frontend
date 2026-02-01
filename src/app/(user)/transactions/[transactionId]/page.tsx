"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Calendar, DollarSign, Tag, ExternalLink } from "lucide-react";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTransaction } from "@/hooks/use-transaction";
import { TRANSACTION_KIND_META, TRANSACTION_STATUS_BADGE } from "@/types/entities/transaction.type";

export default function UserTransactionDetailPage() {
  const { transactionId } = useParams();
  const router = useRouter();
  const { data: transaction, isLoading, error } = useTransaction(transactionId as string);

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

  return (
    <div className="container max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Back Button */}
      <Button onClick={() => router.back()} variant="ghost" size="sm" className="gap-2">
        <ArrowRight className="size-4" />
        بازگشت
      </Button>

      {/* Transaction Info Card */}
      <Card className="overflow-hidden border-none shadow-md bg-card py-0">
        <div className="flex flex-col md:flex-row">
          {/* Right Side: Details */}
          <div className="flex-1 p-6 space-y-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">{`تراکنش ${transaction.code}`}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Tag className="h-3 w-3" />
                    <Badge variant={kindMeta.variant} className="px-2 py-0.5">
                      {kindMeta.label}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>شناسه خارجی</span>
                </div>
                <p className="text-base font-semibold text-foreground">{transaction.externalRef ?? "-"}</p>
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
                <div className="col-span-full space-y-2">
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
          <div className="md:w-64 bg-linear-to-bl from-primary/5 via-muted/10 to-transparent border-t md:border-t-0 md:border-r flex flex-row md:flex-col justify-between items-center md:items-stretch p-4 md:p-6 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-1 h-full bg-linear-to-bl from-primary/50 via-primary/15 to-transparent" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

            {/* Amount display */}
            <div className="relative z-10">
              <div className="hidden md:flex items-center justify-start gap-1.5 text-xs text-muted-foreground mb-2">
                <DollarSign className="h-3.5 w-3.5" />
                <span>مبلغ تراکنش</span>
              </div>
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                <FormattedNumber type="price" value={transaction.amount} />
              </span>
            </div>

            {/* Status section */}
            <div className="md:pt-4 md:border-t border-border/30 flex items-center justify-between relative z-10">
              <span className="hidden md:inline text-xs text-muted-foreground">وضعیت</span>
              <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
