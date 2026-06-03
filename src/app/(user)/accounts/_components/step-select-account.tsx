import AccountCardSelectable from "@/components/entity-specific/account/account-card-selectable";
import { WalletIcon } from "@/components/icons";
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
    <div className="space-y-3">
      <div className="space-y-0.5">
        <p className="text-sm font-semibold">
          انتخاب حساب<span className="text-destructive">*</span>
        </p>
        <p className="text-xs text-muted-foreground">وام به موجودی این حساب اضافه خواهد شد</p>
      </div>

      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto px-0.5 pb-1">
        {isLoading ? (
          <>
            <Skeleton className="h-18 w-full rounded-xl" />
            <Skeleton className="h-18 w-full rounded-xl" />
            <Skeleton className="h-18 w-full rounded-xl" />
          </>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <div className="rounded-full bg-muted p-3">
              <WalletIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">هیچ حساب فعالی یافت نشد</p>
            <p className="text-xs text-muted-foreground">برای درخواست وام باید حساب فعال داشته باشید</p>
          </div>
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
