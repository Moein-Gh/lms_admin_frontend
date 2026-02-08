"use client";

import { useState } from "react";
import { IdCard, Wallet } from "lucide-react";
import { EmptyStateCard } from "@/components/empty-state-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccounts } from "@/hooks/admin/use-account";
import { useAuth } from "@/hooks/admin/use-current-user";
import { AccountTabs } from "./_components/account-tabs";
import { BankCard } from "./_components/bank-card";

export default function UserAccountsPage() {
  const { data: user } = useAuth();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const { data: accountsData, isLoading } = useAccounts({ userId: user?.id }, { enabled: !!user?.id });

  const accounts = accountsData?.data ?? [];

  // Auto-select first account or find the selected one
  const selectedAccount = selectedAccountId
    ? (accounts.find((acc) => acc.id === selectedAccountId) ?? accounts[0])
    : accounts[0];

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!accounts.length) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <EmptyStateCard
          icon={<Wallet className="size-10" />}
          title="هیچ حسابی یافت نشد"
          description="شما هنوز حسابی ندارید. برای ایجاد حساب با پشتیبانی تماس بگیرید."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2 flex flex-row items-center gap-3">
        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl sm:h-12 sm:w-12">
          <IdCard className="size-6 sm:size-7" />
        </div>
        <h1 className="text-2xl font-bold md:text-3xl">حساب‌های من</h1>
      </div>

      {/* Bank Card Hero */}
      <BankCard accounts={accounts} selectedAccount={selectedAccount} onAccountChange={setSelectedAccountId} />

      {/* Tabs: Transactions & Loan Requests */}
      {<AccountTabs key={selectedAccount.id} account={selectedAccount} />}
    </div>
  );
}
