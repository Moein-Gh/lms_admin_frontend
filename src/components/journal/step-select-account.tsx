import React from "react";
import AccountCardSelectable from "@/components/entity-specific/account/account-card-selectable";
import NoAccountCard from "@/components/entity-specific/account/no-account-card";
import type { AllocationFormData } from "@/components/journal/allocate-journal-panel.types";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccounts } from "@/hooks/admin/use-account";
import { AccountStatus, type Account } from "@/types/entities/account.type";
import { AllocationType } from "@/types/entities/journal-entry.type";

export function StepSelectAccount({
  formData,
  setFormData
}: {
  formData: Partial<AllocationFormData>;
  setFormData: (data: Partial<AllocationFormData>) => void;
}) {
  const isMulti = formData.allocationType === AllocationType.SUBSCRIPTION_FEE;

  const params = React.useMemo(() => {
    const base = { userId: formData.userId, pageSize: 100 } as const;
    if (formData.allocationType === AllocationType.LOAN_REPAYMENT) {
      return { ...base, status: AccountStatus.BUSY };
    }
    return base;
  }, [formData.userId, formData.allocationType]);

  const { data: accountsData, isLoading } = useAccounts(params, { enabled: !!formData.userId });

  const sortedAccounts = React.useMemo(() => {
    if (!accountsData?.data) return [];
    return [...accountsData.data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [accountsData]);

  const handleSelect = (account: Account) => {
    if (isMulti) {
      const current = formData.accountIds ?? [];
      const exists = current.includes(account.id);
      const next = exists ? current.filter((id) => id !== account.id) : [...current, account.id];
      setFormData({ ...formData, accountIds: next, items: [] });
    } else {
      setFormData({ ...formData, accountId: account.id, loanId: undefined, items: [] });
    }
  };

  const isSelected = (accountId: string) => {
    if (isMulti) return (formData.accountIds ?? []).includes(accountId);
    return formData.accountId === accountId;
  };

  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : sortedAccounts.length === 0 ? (
        <NoAccountCard title="حسابی یافت نشد" description="برای این کاربر حسابی با وام فعال یافت نشد." />
      ) : (
        <div className="grid grid-cols-1 gap-2 max-h-75 overflow-y-auto">
          {sortedAccounts
            .filter((a) => a.status === AccountStatus.ACTIVE || a.status === AccountStatus.BUSY)
            .map((account) => (
              <AccountCardSelectable
                key={account.id}
                account={account}
                selected={isSelected(account.id)}
                onSelect={handleSelect}
              />
            ))}
        </div>
      )}
    </>
  );
}
