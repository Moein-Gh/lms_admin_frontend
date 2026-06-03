"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { EmptyStateCard } from "@/components/empty-state-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/admin/use-current-user";
import { transactionKeys } from "@/hooks/user/use-transaction";
import { listUserTransactions } from "@/lib/user-APIs/transaction-api";
import { type Transaction } from "@/types/entities/transaction.type";
import { CreateDepositDialog } from "./create-deposit-dialog";
import { TransactionCard } from "./transaction-card";

const PAGE_SIZE = 9;
const INITIAL_PAGE_PARAM = 1;

export function RecentTransactionsSection() {
  const { data: user, isLoading: isUserLoading } = useAuth();
  const loadTriggerRef = useRef<HTMLDivElement | null>(null);
  const wasIntersectingRef = useRef(false);
  const [isInfiniteScrollInitialized, setIsInfiniteScrollInitialized] = useState(false);

  const { data, isLoading, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [...transactionKeys.lists(), "infinite", user?.id, PAGE_SIZE],
    queryFn: ({ pageParam }) =>
      listUserTransactions({
        page: pageParam,
        pageSize: PAGE_SIZE,
        userId: user?.id
      }),
    initialPageParam: INITIAL_PAGE_PARAM,
    getNextPageParam: (lastPage) => (lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined),
    enabled: !!user?.id
  });

  const items = useMemo(() => {
    const allTransactions = data?.pages.flatMap((pageItem) => pageItem.data) ?? [];
    const uniqueItems = new Map<string, Transaction>();

    for (const transaction of allTransactions) {
      uniqueItems.set(transaction.id, transaction);
    }

    return [...uniqueItems.values()];
  }, [data]);

  const hasTransactions = items.length > 0;
  const isInitialLoading = isUserLoading || (isLoading && !hasTransactions);
  const isLoadingMore = isFetchingNextPage;

  useEffect(() => {
    const triggerElement = loadTriggerRef.current;
    if (!triggerElement || !hasNextPage || !isInfiniteScrollInitialized) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        const hasEnteredTrigger = isIntersecting && !wasIntersectingRef.current;

        if (hasEnteredTrigger && !isFetching && !isInitialLoading) {
          void fetchNextPage();
        }

        wasIntersectingRef.current = isIntersecting;
      },
      {
        root: null,
        threshold: 0.95
      }
    );

    observer.observe(triggerElement);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetching, isInfiniteScrollInitialized, isInitialLoading]);

  const handleInitializeInfiniteScroll = async () => {
    setIsInfiniteScrollInitialized(true);
    await fetchNextPage();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold md:text-xl">تراکنش‌های اخیر</h2>
        <CreateDepositDialog />
      </div>

      {isInitialLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={`loading-skeleton-${index}`} className="h-24 rounded-lg bg-card animate-pulse" />
          ))}
        </div>
      )}

      {!isInitialLoading && !hasTransactions && (
        <EmptyStateCard title="تراکنشی یافت نشد" description="هنوز هیچ تراکنشی ثبت نشده است." />
      )}

      {!isInitialLoading && hasTransactions && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {items.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center">
              {!isInfiniteScrollInitialized && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full border-dashed bg-background/70 md:w-auto"
                  onClick={() => {
                    void handleInitializeInfiniteScroll();
                  }}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? "در حال بارگذاری..." : "بارگذاری بیشتر"}
                </Button>
              )}

              {isInfiniteScrollInitialized && <div ref={loadTriggerRef} className="h-2 w-full" aria-hidden="true" />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
