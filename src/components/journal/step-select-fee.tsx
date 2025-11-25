import type { AllocationFormData } from "@/components/journal/allocate-journal-panel.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLoans } from "@/hooks/use-loan";
import { useSubscriptionFees } from "@/hooks/use-subscription-fee";
import { AllocationType } from "@/types/entities/journal-entry.type";

export function StepSelectFee({
  formData,
  setFormData
}: {
  formData: Partial<AllocationFormData>;
  setFormData: (data: Partial<AllocationFormData>) => void;
}) {
  const { data: feesData, isLoading } = useSubscriptionFees({ accountId: formData.accountId, pageSize: 100 });

  const selectedFee = feesData?.data.find((f) => f.id === formData.targetId);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="fee">انتخاب هزینه اشتراک</Label>
        <Select
          value={formData.targetId}
          onValueChange={(value) => {
            const fee = feesData?.data.find((f) => f.id === value);
            // Assuming subscription fee is a property of loan or calculated
            setFormData({
              ...formData,
              targetId: value,
              allocationType: AllocationType.SUBSCRIPTION_FEE,
              amount: fee?.amount ?? formData.amount
            });
          }}
          disabled={isLoading}
        >
          <SelectTrigger id="fee">
            <SelectValue placeholder={isLoading ? "در حال بارگذاری..." : "انتخاب هزینه اشتراک"} />
          </SelectTrigger>
          <SelectContent>
            {feesData?.data.map((fee) => (
              <SelectItem key={fee.id} value={fee.id}>
                {fee.code || `کد: ${fee.code}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedFee && (
        <div className="space-y-2">
          <Label htmlFor="amount">مبلغ هزینه اشتراک</Label>
          <Input id="amount" type="text" value={Number(selectedFee.amount).toLocaleString("fa-IR")} disabled />
        </div>
      )}
    </>
  );
}
