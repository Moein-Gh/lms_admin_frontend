import AccountCardSelectable from "@/components/entity-specific/account/account-card-selectable";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { Account } from "@/types/entities/account.type";

type StepSelectAccountProps = {
  accounts: Account[];
  isLoading: boolean;
  selectedAccountId: string | undefined;
  setSelectedAccountId: (id: string | undefined) => void;
  setValue: (name: "accountId", value: string, options?: { shouldValidate?: boolean }) => void;
};

export function StepSelectAccount({
  accounts,
  isLoading,
  selectedAccountId,
  setSelectedAccountId,
  setValue
}: StepSelectAccountProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        انتخاب حساب
        <span className="text-destructive">*</span>
      </Label>
      <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto px-0.5 pt-1">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : accounts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">هیچ حسابی یافت نشد</p>
        ) : (
          accounts.map((account) => (
            <AccountCardSelectable
              key={account.id}
              account={account}
              selected={selectedAccountId === account.id}
              onSelect={() => {
                setSelectedAccountId(account.id);
                setValue("accountId", account.id, { shouldValidate: true });
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
