import AccountCardSelectable from "@/components/entity-specific/account/account-card-selectable";
import { ComboboxFilter } from "@/components/filters/combobox-filter";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AccountStatus, type Account } from "@/types/entities/account.type";

type StepSelectUserAccountProps = {
  usersOptions: { id: string; name: string }[];
  selectedUser: string | undefined;
  setSelectedUser: (id: string | undefined) => void;
  selectedAccountId: string | undefined;
  setSelectedAccountId: (id: string | undefined) => void;
  setValue: (name: "accountId", value: string, options?: { shouldValidate?: boolean }) => void;
  accountsData: { data?: Account[] } | undefined;
  accountsLoading: boolean;
};

export function StepSelectUserAccount({
  usersOptions,
  selectedUser,
  setSelectedUser,
  selectedAccountId,
  setSelectedAccountId,
  setValue,
  accountsData,
  accountsLoading
}: StepSelectUserAccountProps) {
  const activeAccounts = (accountsData?.data ?? []).filter((a) => a.status === AccountStatus.ACTIVE);

  return (
    <div className="space-y-2">
      <Label htmlFor="user" className="text-sm font-medium">
        کاربر
        <span className="text-destructive">*</span>
      </Label>
      <ComboboxFilter
        items={usersOptions}
        selectedValue={selectedUser}
        onSelect={(v) => {
          const id = v ?? undefined;
          setSelectedUser(id);
          setSelectedAccountId(undefined);
          setValue("accountId", "", { shouldValidate: true });
        }}
        getItemId={(i) => i.id}
        getItemLabel={(i) => i.name}
        placeholder="کاربر را انتخاب کنید"
        searchPlaceholder="جستجوی کاربر..."
        emptyMessage="کاربری یافت نشد"
        allLabel={""}
      />
      {selectedUser && (
        <div className="mt-3 grid grid-cols-1 gap-2">
          {accountsLoading ? (
            <p className="text-sm text-muted-foreground">در حال بارگذاری حساب‌ها...</p>
          ) : activeAccounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">این کاربر حسابی برای اعطای وام ندارد</p>
          ) : (
            activeAccounts.map((account) => (
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
      )}
    </div>
  );
}
