import React from "react";
import AccountCardSelectable from "@/components/entity-specific/account/account-card-selectable";
import NoAccountCard from "@/components/entity-specific/account/no-account-card";
import type { AllocationFormData } from "@/components/journal/allocate-journal-panel.types";
import { useAccounts } from "@/hooks/use-account";
import { AccountStatus } from "@/types/entities/account.type";
import { AllocationType } from "@/types/entities/journal-entry.type";

export function StepSelectAccount({
  formData,
  setFormData
}: {
  formData: Partial<AllocationFormData>;
  setFormData: (data: Partial<AllocationFormData>) => void;
}) {
  const params = React.useMemo(() => {
    const base = { userId: formData.userId, pageSize: 100 } as const;
    if (formData.allocationType === AllocationType.LOAN_REPAYMENT) {
      return { ...base, status: AccountStatus.RESTRICTED };
    }
    return base;
  }, [formData.userId, formData.allocationType]);

  const { data: accountsData, isLoading } = useAccounts(params, { enabled: !!formData.userId });

  const sortedAccounts = React.useMemo(() => {
    if (!accountsData?.data) return [];
    return [...accountsData.data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [accountsData]);

  return (
    <>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
      ) : sortedAccounts.length === 0 ? (
        <NoAccountCard title="حسابی یافت نشد" description="برای این کاربر حسابی با وام فعال یافت نشد." />
      ) : (
        <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
          {sortedAccounts.map((account) => (
            <AccountCardSelectable
              key={account.id}
              account={account}
              selected={formData.accountId === account.id}
              onSelect={(a) => setFormData({ ...formData, accountId: a.id, loanId: undefined, targetId: a.id })}
            />
          ))}
        </div>
      )}
    </>
  );
}
