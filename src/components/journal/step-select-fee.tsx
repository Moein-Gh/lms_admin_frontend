import { ReceiptIcon } from "lucide-react";
import SubscriptionFeeCardSelectable from "@/components/entity-specific/subscription-fee/subscription-fee-card-selectable";
import type { AllocationFormData } from "@/components/journal/allocate-journal-panel.types";
import { useSubscriptionFees } from "@/hooks/admin/use-subscription-fee";
import { OrderDirection } from "@/types/api";

export function StepSelectFee({
  formData,
  setFormData
}: {
  formData: Partial<AllocationFormData>;
  setFormData: (data: Partial<AllocationFormData>) => void;
}) {
  const { data: feesData, isLoading } = useSubscriptionFees({
    accountId: formData.accountId,
    pageSize: 100,
    orderDir: OrderDirection.ASC
  });

  const selectedIds = new Set((formData.items ?? []).map((item) => item.targetId));
  const selectedCount = selectedIds.size;

  const handleToggleFee = (feeId: string, amount: number) => {
    const currentItems = formData.items ?? [];
    const isSelected = selectedIds.has(feeId);

    if (isSelected) {
      // Remove from selection
      setFormData({
        ...formData,
        items: currentItems.filter((item) => item.targetId !== feeId)
      });
    } else {
      // Add to selection
      setFormData({
        ...formData,
        items: [...currentItems, { targetId: feeId, amount }]
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <ReceiptIcon className="size-4 text-muted-foreground" />
          <span>انتخاب ماهیانه</span>
        </div>
        {selectedCount > 0 && <div className="text-sm text-muted-foreground">{selectedCount} ماهیانه انتخاب شده</div>}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
          {feesData?.data.map((fee) => (
            <SubscriptionFeeCardSelectable
              key={fee.id}
              fee={fee}
              selected={selectedIds.has(fee.id)}
              onSelect={() => handleToggleFee(fee.id, Number(fee.amount))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
