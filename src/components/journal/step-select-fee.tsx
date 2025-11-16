import type { AllocationFormData } from "@/components/journal/allocate-journal-panel.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLoans } from "@/hooks/use-loan";

export function StepSelectFee({
  formData,
  setFormData
}: {
  formData: Partial<AllocationFormData>;
  setFormData: (data: Partial<AllocationFormData>) => void;
}) {
  const { data: loansData, isLoading } = useLoans(
    { accountId: formData.accountId, pageSize: 100 },
    { enabled: !!formData.accountId }
  );

  const selectedLoan = loansData?.data.find((l) => l.id === formData.targetId);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="fee">انتخاب هزینه اشتراک</Label>
        <Select
          value={formData.targetId}
          onValueChange={(value) => {
            const loan = loansData?.data.find((l) => l.id === value);
            // Assuming subscription fee is a property of loan or calculated
            setFormData({
              ...formData,
              targetId: value,
              amount: loan?.amount ?? formData.amount
            });
          }}
          disabled={isLoading}
        >
          <SelectTrigger id="fee">
            <SelectValue placeholder={isLoading ? "در حال بارگذاری..." : "انتخاب هزینه اشتراک"} />
          </SelectTrigger>
          <SelectContent>
            {loansData?.data.map((loan) => (
              <SelectItem key={loan.id} value={loan.id}>
                {loan.name || `کد: ${loan.code}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedLoan && (
        <div className="space-y-2">
          <Label htmlFor="amount">مبلغ هزینه اشتراک</Label>
          <Input id="amount" type="text" value={Number(selectedLoan.amount).toLocaleString("fa-IR")} disabled />
        </div>
      )}
    </>
  );
}
