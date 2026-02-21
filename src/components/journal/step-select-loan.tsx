import LoanCardSelectable from "@/components/entity-specific/loan/loan-card-selectable";
import NoLoanCard from "@/components/entity-specific/loan/no-loan-card";
import { Landmark } from "@/components/icons";
import type { AllocationFormData } from "@/components/journal/allocate-journal-panel.types";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoans } from "@/hooks/admin/use-loan";
import { LoanStatus } from "@/types/entities/loan.type";

export function StepSelectLoan({
  formData,
  setFormData
}: {
  formData: Partial<AllocationFormData>;
  setFormData: (data: Partial<AllocationFormData>) => void;
}) {
  const { data: loansData, isLoading } = useLoans(
    { accountId: formData.accountId, status: LoanStatus.ACTIVE, pageSize: 100 },
    { enabled: !!formData.accountId }
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Landmark className="size-4 text-muted-foreground" />
        <span>انتخاب وام</span>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : !loansData?.data.length ? (
        <NoLoanCard />
      ) : (
        <div className="grid grid-cols-1 gap-3 max-h-105 overflow-y-auto">
          {loansData.data.map((loan) => (
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
