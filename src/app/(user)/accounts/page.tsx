"use client";

import { useState } from "react";
import { EmptyStateCard } from "@/components/empty-state-card";
import { CardIcon, AccountIcon } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/admin/use-current-user";
import { useUserAccounts } from "@/hooks/user/use-account";
import { PageHeader } from "../_components/page-header";
import { AccountTabs } from "./_components/account-tabs";
import { BankCard } from "./_components/bank-card";
import { CreateLoanRequestButton } from "./_components/create-loan-request-button";

export default function UserAccountsPage() {
  const { data: user } = useAuth();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const { data: accountsData, isLoading } = useUserAccounts({ userId: user?.id }, { enabled: !!user?.id });

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
          icon={<AccountIcon className="size-10" />}
          title="هیچ حسابی یافت نشد"
          description="شما هنوز حسابی ندارید. برای ایجاد حساب با پشتیبانی تماس بگیرید."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <PageHeader
        icon={CardIcon}
        title="حساب‌های من"
        actions={<CreateLoanRequestButton accountId={selectedAccount.id} />}
      />

      {/* Bank Card Hero */}
      <BankCard accounts={accounts} selectedAccount={selectedAccount} onAccountChange={setSelectedAccountId} />

      {/* Tabs: Transactions & Loan Requests */}
      <AccountTabs key={selectedAccount.id} account={selectedAccount} />
    </div>
  );
}
