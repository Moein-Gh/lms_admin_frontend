"use client";

import { useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { EmptyStateCard } from "@/components/empty-state-card";
import { FormattedNumber } from "@/components/formatted-number";
import { TransactionIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/admin/use-current-user";
import { transactionKeys } from "@/hooks/user/use-transaction";
import { listUserTransactions } from "@/lib/user-APIs/transaction-api";
import { TransactionKind, TransactionStatus, type Transaction } from "@/types/entities/transaction.type";
import { CreateDepositDialog } from "../_components/create-deposit-dialog";
import { PageHeader } from "../_components/page-header";
import { TransactionCard } from "../_components/transaction-card";

const PAGE_SIZE = 12;

function parseAmount(value: string): number {
  const normalized = Number(String(value).replace(/[^0-9.-]+/g, ""));
  return Number.isNaN(normalized) ? 0 : normalized;
}

export default function UserTransactionsPage() {
  const { data: user } = useAuth();
  const [isLoadMoreEnabled, setIsLoadMoreEnabled] = useState(false);

  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [...transactionKeys.lists(), "transactions-page", user?.id, PAGE_SIZE],
    queryFn: ({ pageParam }) =>
      listUserTransactions({
        page: pageParam,
        pageSize: PAGE_SIZE,
        userId: user?.id
      }),
    enabled: !!user?.id,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined)
  });

  const items = useMemo(() => {
    const allTransactions = data?.pages.flatMap((pageItem) => pageItem.data) ?? [];
    const uniqueItems = new Map<string, Transaction>();

    for (const transaction of allTransactions) {
      uniqueItems.set(transaction.id, transaction);
    }

    return [...uniqueItems.values()];
  }, [data]);

  const pendingCount = items.filter((transaction) => transaction.status === TransactionStatus.PENDING).length;
  const approvedDepositsAmount = items
    .filter((transaction) => {
      return transaction.status === TransactionStatus.APPROVED && transaction.kind === TransactionKind.DEPOSIT;
    })
    .reduce((sum, transaction) => sum + parseAmount(transaction.amount), 0);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="space-y-6">
        <PageHeader
          icon={TransactionIcon}
          title="تراکنش‌های من"
          subtitle="همه تراکنش‌های شما در یک نمای کامل"
          actions={<CreateDepositDialog buttonSize="sm" buttonLabel="واریز جدید" />}
        />

        {!isLoading && !error && items.length > 0 && (
          <Card className="border-border/60 py-4">
            <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">تراکنش‌های بارگذاری‌شده</p>
                <p className="mt-1 text-lg font-bold tabular-nums">{items.length}</p>
              </div>

              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">در انتظار تایید</p>
                <p className="mt-1 text-lg font-bold tabular-nums">{pendingCount}</p>
              </div>

              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">واریز تایید شده</p>
                <p className="mt-1 text-sm font-bold tabular-nums md:text-base">
                  <FormattedNumber type="price" value={String(approvedDepositsAmount)} />
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={`skeleton-${index}`} className="h-24 rounded-lg border bg-card animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <EmptyStateCard
            title="خطا در بارگذاری"
            description="امکان بارگذاری تراکنش‌ها وجود ندارد. لطفاً دوباره تلاش کنید."
          />
        )}

        {!isLoading && !error && items.length === 0 && (
          <EmptyStateCard title="تراکنشی یافت نشد" description="هنوز هیچ تراکنشی ثبت نشده است." />
        )}

        {!isLoading && !error && items.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {items.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>

            {hasNextPage && (
              <div className="flex justify-center pt-2">
                {!isLoadMoreEnabled ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full border-dashed bg-background/70 md:w-auto"
                    disabled={isFetchingNextPage}
                    onClick={() => {
                      setIsLoadMoreEnabled(true);
                      void fetchNextPage();
                    }}
                  >
                    {isFetchingNextPage ? "در حال بارگذاری..." : "بارگذاری بیشتر"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full border-dashed bg-background/70 md:w-auto"
                    disabled={isFetchingNextPage}
                    onClick={() => {
                      void fetchNextPage();
                    }}
                  >
                    {isFetchingNextPage ? "در حال بارگذاری..." : "نمایش تراکنش‌های بیشتر"}
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
