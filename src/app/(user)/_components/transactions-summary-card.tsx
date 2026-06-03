"use client";

import { useState } from "react";
import Link from "next/link";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { ArrowLeft, Clock, TransactionIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/admin/use-current-user";
import { useUserTransactions } from "@/hooks/user/use-transaction";
import { TransactionKind, TransactionStatus, type Transaction } from "@/types/entities/transaction.type";

const SNAPSHOT_SIZE = 24;
const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

function parseAmount(value: string): number {
  const normalized = Number(String(value).replace(/[^0-9.-]+/g, ""));
  return Number.isNaN(normalized) ? 0 : normalized;
}

export function TransactionsSummaryCard() {
  const [snapshotTime] = useState(() => Date.now());
  const { data: user } = useAuth();
  const { data, isLoading } = useUserTransactions({
    page: 1,
    pageSize: SNAPSHOT_SIZE,
    userId: user?.id
  });

  const transactions = data?.data ?? [];

  if (isLoading) {
    return (
      <Card className="border-border/60 py-4">
        <CardHeader>
          <Skeleton className="h-6 w-44" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-18 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="border-border/60 py-4">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/5 text-primary shadow-sm">
              <TransactionIcon className="size-6" />
            </div>
            <div>
              <h2 className="text-base font-bold md:text-lg">خلاصه تراکنش‌ها</h2>
              <p className="text-xs text-muted-foreground md:text-sm">هنوز تراکنشی ثبت نشده است.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild className="w-full md:w-auto">
            <Link href="/transactions" className="inline-flex items-center gap-2">
              مشاهده صفحه تراکنش‌ها
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const latestTransaction = transactions.reduce<Transaction>((latest, current) => {
    return new Date(current.createdAt).getTime() > new Date(latest.createdAt).getTime() ? current : latest;
  }, transactions[0]);

  const fromDate = snapshotTime - THIRTY_DAYS_IN_MS;
  const monthlyTransactions = transactions.filter((transaction) => {
    return new Date(transaction.createdAt).getTime() >= fromDate;
  });

  const pendingCount = transactions.filter((transaction) => transaction.status === TransactionStatus.PENDING).length;

  const approvedDepositsLastMonth = monthlyTransactions
    .filter((transaction) => {
      return transaction.kind === TransactionKind.DEPOSIT && transaction.status === TransactionStatus.APPROVED;
    })
    .reduce((sum, transaction) => sum + parseAmount(transaction.amount), 0);

  return (
    <Card className="overflow-hidden border-border/60 py-4">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/5 text-primary shadow-sm">
            <TransactionIcon className="size-6" />
          </div>

          <div className="flex flex-1 items-center gap-3 md:gap-4">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">واریز تایید شده (۳۰ روز)</p>
              <p className="mt-0.5 text-2xl font-bold tracking-tight md:text-3xl">
                <FormattedNumber type="price" value={String(approvedDepositsLastMonth)} />
              </p>
            </div>

            <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-12 bg-border" />
            <div className="flex flex-col items-center gap-1 rounded-xl bg-card/40 px-3 py-2 text-center md:px-4 md:py-2.5">
              <span className="text-lg font-bold text-primary md:text-xl">{pendingCount}</span>
              <span className="text-xs text-muted-foreground">در انتظار</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          <div className="text-start">
            <p className="text-[11px] text-muted-foreground">تراکنش‌های ۳۰ روز اخیر</p>
            <p className="mt-1 text-sm font-bold">
              <FormattedNumber type="normal" value={monthlyTransactions.length} />
            </p>
          </div>

          <div className="text-end">
            <p className="text-[11px] text-muted-foreground">آخرین تراکنش</p>
            <p className="mt-1 text-sm font-bold">
              <FormattedNumber type="price" value={latestTransaction.amount} />
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card/40 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">آخرین تراکنش</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              <FormattedDate value={latestTransaction.createdAt} />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 text-sm">
            <p className="font-medium">کد {latestTransaction.code}</p>
            <p className="text-sm font-bold tabular-nums">
              <FormattedNumber type="price" value={latestTransaction.amount} />
            </p>
          </div>
        </div>

        <Button variant="outline" asChild className="w-full md:w-auto">
          <Link href="/transactions" className="inline-flex items-center gap-2">
            مشاهده همه تراکنش‌ها
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
