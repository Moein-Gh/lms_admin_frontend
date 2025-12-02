import { LandmarkIcon } from "lucide-react";
import LoanCardSelectable from "@/components/entity-specific/loan/loan-card-selectable";
import type { AllocationFormData } from "@/components/journal/allocate-journal-panel.types";
import { useLoans } from "@/hooks/use-loan";

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
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <LandmarkIcon className="size-4 text-muted-foreground" />
        <span>انتخاب وام</span>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 max-h-[420px] overflow-y-auto">
          {loansData?.data.map((loan) => (
            <LoanCardSelectable
              key={loan.id}
              loan={loan}
              selected={formData.loanId === loan.id}
              onSelect={() => setFormData({ ...formData, loanId: loan.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
