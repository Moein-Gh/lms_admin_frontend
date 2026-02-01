"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EmptyStateCard } from "@/components/empty-state-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-current-user";
import { useTransactions } from "@/hooks/use-transaction";
import { CreateDepositDialog } from "./_components/create-deposit-dialog";
import { NextPaymentSection } from "./_components/next-payment-section";
import { TransactionCard } from "./_components/transaction-card";

export default function UserDashboardPage() {
  const { data: user } = useAuth();

  // Fetch last 3 transactions for the current user
  const { data: transactionsData, isLoading } = useTransactions({
    page: 1,
    pageSize: 3,
    userId: user?.id
  });

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold md:text-3xl">داشبورد</h1>
          <p className="text-sm text-muted-foreground md:text-base">خوش آمدید {user?.identity.name}</p>
        </div>

        {/* Main Content */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Summary Cards */}
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">کل حساب‌ها</h3>
            <p className="mt-2 text-2xl font-bold">-</p>
          </div>

          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">کل وام‌ها</h3>
            <p className="mt-2 text-2xl font-bold">-</p>
          </div>

          <div className="rounded-lg border bg-card p-4 shadow-sm md:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-medium text-muted-foreground">موجودی کل</h3>
            <p className="mt-2 text-2xl font-bold">-</p>
          </div>
        </div>

        {/* Next Payment Section */}
        <NextPaymentSection />

        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold md:text-xl">تراکنش‌های اخیر</h2>
            <CreateDepositDialog />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={`loading-skeleton-${i}`} className="h-24 rounded-lg border bg-card animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!transactionsData || transactionsData.data.length === 0) && (
            <EmptyStateCard title="تراکنشی یافت نشد" description="هنوز هیچ تراکنشی ثبت نشده است." />
          )}

          {/* Transactions List */}
          {!isLoading && transactionsData && transactionsData.data.length > 0 && (
            <div className="space-y-3">
              {transactionsData.data.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/transactions" className="gap-2">
                  مشاهده تمام تراکنش‌ها
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
