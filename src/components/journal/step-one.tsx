import { ComboboxFilter } from "@/components/filters/combobox-filter";
import type { AllocationFormData } from "@/components/journal/allocate-journal-panel.types";
import { Label } from "@/components/ui/label";
import { Pills } from "@/components/ui/pills";
import { useUsers } from "@/hooks/use-user";
import { AllocationType } from "@/types/entities/journal-entry.type";

const allocationTypeOptions = [
  { value: AllocationType.ACCOUNT_BALANCE, label: "موجودی حساب" },
  { value: AllocationType.LOAN_REPAYMENT, label: "بازپرداخت وام" },
  { value: AllocationType.SUBSCRIPTION_FEE, label: "هزینه اشتراک" }
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
      <div className="space-y-2">
        <Label>نوع تخصیص</Label>
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
        <div className="space-y-2">
          <Label>کاربر</Label>
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
      )}
    </>
  );
}
