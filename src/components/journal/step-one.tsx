import type { AllocationFormData } from "@/components/journal/allocate-journal-panel.types";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUsers } from "@/hooks/use-user";
import { AllocationType } from "@/types/entities/journal-entry.type";

export function StepOne({
  formData,
  setFormData
}: {
  formData: Partial<AllocationFormData>;
  setFormData: (data: Partial<AllocationFormData>) => void;
}) {
  const { data: usersData } = useUsers({ pageSize: 100 });

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="user">کاربر</Label>
        <Select value={formData.userId} onValueChange={(value) => setFormData({ ...formData, userId: value })}>
          <SelectTrigger id="user">
            <SelectValue placeholder="انتخاب کاربر" />
          </SelectTrigger>
          <SelectContent>
            {usersData?.data.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.identity.name ?? user.identity.phone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="kind">نوع موجودیت</Label>
        <Select
          value={formData.allocationType}
          onValueChange={(value) => setFormData({ ...formData, allocationType: value as AllocationType })}
        >
          <SelectTrigger id="kind">
            <SelectValue placeholder="انتخاب نوع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AllocationType.ACCOUNT_BALANCE}>موجودی حساب</SelectItem>
            <SelectItem value={AllocationType.LOAN_REPAYMENT}>بازپرداخت وام</SelectItem>
            <SelectItem value={AllocationType.FEE}>هزینه اشتراک</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
