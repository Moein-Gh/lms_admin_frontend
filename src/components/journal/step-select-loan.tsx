import type { AllocationFormData } from "@/components/journal/allocate-journal-panel.types";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLoans } from "@/hooks/use-loan";
import { cn } from "@/lib/utils";

export function StepSelectLoan({
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

  return (
    <div className="space-y-2">
      <Label>انتخاب وام</Label>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
      ) : (
        <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
          {loansData?.data.map((loan) => (
            <Card
              key={loan.id}
              className={cn(
                "p-3 cursor-pointer transition-colors hover:bg-accent",
                formData.loanId === loan.id && "border-primary bg-accent"
              )}
              onClick={() => setFormData({ ...formData, loanId: loan.id })}
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{loan.name || `کد: ${loan.code}`}</span>
                  <span className="text-xs text-muted-foreground">
                    مبلغ: {Number(loan.amount).toLocaleString("fa-IR")} ریال
                  </span>
                </div>
                {formData.loanId === loan.id && (
                  <span className="text-xs text-primary font-semibold">✓ انتخاب شده</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
