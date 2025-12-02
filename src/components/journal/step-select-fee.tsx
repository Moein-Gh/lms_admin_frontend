import { ReceiptIcon } from "lucide-react";
import SubscriptionFeeCardSelectable from "@/components/entity-specific/subscription-fee/subscription-fee-card-selectable";
import type { AllocationFormData } from "@/components/journal/allocate-journal-panel.types";
import { useSubscriptionFees } from "@/hooks/use-subscription-fee";
import { OrderDirection } from "@/types/api";
import { AllocationType } from "@/types/entities/journal-entry.type";

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

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <ReceiptIcon className="size-4 text-muted-foreground" />
        <span>انتخاب ماهیانه</span>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
          {feesData?.data.map((fee) => (
            <SubscriptionFeeCardSelectable
              key={fee.id}
              fee={fee}
              selected={formData.targetId === fee.id}
              onSelect={() =>
                setFormData({
                  ...formData,
                  targetId: fee.id,
                  allocationType: AllocationType.SUBSCRIPTION_FEE,
                  amount: fee.amount
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
