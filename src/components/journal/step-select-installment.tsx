import type { AllocationFormData } from "@/components/journal/allocate-journal-panel.types";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useInstallments } from "@/hooks/use-installment";
import { cn } from "@/lib/utils";
import { OrderDirection } from "@/types/api";
import { InstallmentStatus } from "@/types/entities/installment.type";
import { FormattedNumber } from "../formatted-number";

export function StepSelectInstallment({
  formData,
  setFormData
}: {
  formData: Partial<AllocationFormData>;
  setFormData: (data: Partial<AllocationFormData>) => void;
}) {
  const { data: installmentsData, isLoading } = useInstallments(
    {
      loanId: formData.loanId,
      pageSize: 5,
      status: InstallmentStatus.ACTIVE,
      orderBy: "dueDate",
      orderDir: OrderDirection.ASC
    },
    { enabled: !!formData.loanId }
  );

  const selectedInstallment = installmentsData?.data.find((i) => i.id === formData.targetId);

  return (
    <div className="space-y-2">
      <Label>انتخاب قسط</Label>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
      ) : (
        <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
          {installmentsData?.data.map((installment) => (
            <Card
              key={installment.id}
              className={cn(
                "p-3 cursor-pointer transition-colors hover:bg-accent",
                formData.targetId === installment.id && "border-primary bg-accent"
              )}
              onClick={() => {
                setFormData({
                  ...formData,
                  targetId: installment.id,
                  amount: installment.amount
                });
              }}
            >
              <div className="flex justify-center items-center">
                <div className="flex w-full flex-row gap-1 justify-between">
                  <div>
                    <span className="font-medium">قسط {installment.code}</span>
                  </div>
                  <div>
                    <FormattedNumber type="price" value={installment.amount} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
