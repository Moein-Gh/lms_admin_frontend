import { LayoutGridIcon, UserIcon, WalletIcon } from "lucide-react";
import { ComboboxFilter } from "@/components/filters/combobox-filter";
import type { AllocationFormData } from "@/components/journal/allocate-journal-panel.types";
import { Pills } from "@/components/ui/pills";
import { Separator } from "@/components/ui/separator";
import { useUsers } from "@/hooks/use-user";
import { AllocationType } from "@/types/entities/journal-entry.type";
import { StepSelectAccount } from "./step-select-account";

const allocationTypeOptions = [
  { value: AllocationType.ACCOUNT_BALANCE, label: "موجودی حساب" },
  { value: AllocationType.LOAN_REPAYMENT, label: "بازپرداخت وام" },
  { value: AllocationType.SUBSCRIPTION_FEE, label: "ماهیانه" }
];

export function StepOne({
  formData,
  setFormData
}: {
  formData: Partial<AllocationFormData>;
  setFormData: (data: Partial<AllocationFormData>) => void;
}) {
  const { data: usersData } = useUsers({ pageSize: 100 });
  const users = usersData?.data ?? [];

  return (
    <>
      {/* Allocation Type Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <LayoutGridIcon className="size-4 text-muted-foreground" />
          <span>نوع تخصیص</span>
        </div>
        <Pills
          options={allocationTypeOptions}
          value={formData.allocationType}
          onValueChange={(value) =>
            setFormData({ ...formData, allocationType: value as AllocationType, userId: undefined })
          }
          variant="outline"
          size="sm"
          allowDeselect={false}
        />
      </div>

      {formData.allocationType && (
        <>
          <Separator className="my-4" />
          {/* User Selection Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <UserIcon className="size-4 text-muted-foreground" />
              <span>کاربر</span>
            </div>
            <ComboboxFilter
              items={users}
              selectedValue={formData.userId}
              onSelect={(value) => setFormData({ ...formData, userId: value })}
              getItemId={(user) => user.id}
              getItemLabel={(user) => user.identity.name ?? String(user.identity.phone)}
              placeholder="انتخاب کاربر"
              searchPlaceholder="جستجوی کاربر..."
              emptyMessage="کاربری یافت نشد"
              allLabel=""
            />
          </div>
        </>
      )}

      {/* Account Selection Section */}
      {formData.userId && (
        <>
          <Separator className="my-4" />
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <WalletIcon className="size-4 text-muted-foreground" />
              <span>انتخاب حساب</span>
            </div>
            <StepSelectAccount formData={formData} setFormData={setFormData} />
          </div>
        </>
      )}
    </>
  );
}
