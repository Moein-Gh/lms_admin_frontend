import { CalendarCheckIcon } from "lucide-react";
import InstallmentCardSelectable from "@/components/entity-specific/installment/installment-card-selectable";
import type { AllocationFormData } from "@/components/journal/allocate-journal-panel.types";
import { useInstallments } from "@/hooks/use-installment";
import { OrderDirection } from "@/types/api";
import { InstallmentStatus } from "@/types/entities/installment.type";

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

  const selectedIds = new Set((formData.items ?? []).map((item) => item.targetId));
  const selectedCount = selectedIds.size;

  const handleToggleInstallment = (installmentId: string, amount: number) => {
    const currentItems = formData.items ?? [];
    const isSelected = selectedIds.has(installmentId);

    if (isSelected) {
      // Remove from selection
      setFormData({
        ...formData,
        items: currentItems.filter((item) => item.targetId !== installmentId)
      });
    } else {
      // Add to selection
      setFormData({
        ...formData,
        items: [...currentItems, { targetId: installmentId, amount }]
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <CalendarCheckIcon className="size-4 text-muted-foreground" />
          <span>انتخاب قسط</span>
        </div>
        {selectedCount > 0 && <div className="text-sm text-muted-foreground">{selectedCount} قسط انتخاب شده</div>}
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
      ) : (
        <div className="grid grid-cols-1 gap-2 max-h-75 overflow-y-auto">
          {installmentsData?.data.map((installment) => (
            <InstallmentCardSelectable
              key={installment.id}
              installment={installment}
              selected={selectedIds.has(installment.id)}
              onSelect={() => handleToggleInstallment(installment.id, Number(installment.amount))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
