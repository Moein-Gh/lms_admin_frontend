import * as React from "react";
import { BanknoteIcon } from "lucide-react";
import AmountInput from "@/components/form/amount-input";
import { Button } from "@/components/ui/button";
import type { AllocationFormData } from "./allocate-journal-panel.types";

export function AccountBalanceAmountStep({
  formData,
  setFormData,
  unbalancedAmount
}: {
  readonly formData: Partial<AllocationFormData>;
  readonly setFormData: (data: Partial<AllocationFormData>) => void;
  readonly unbalancedAmount: number;
}) {
  // For account balance, we only have one item, so we use the first item's amount
  const currentAmount = formData.items?.[0]?.amount?.toString() ?? "";

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = parseFloat(value);

    if (!value || isNaN(numericValue)) {
      setFormData({ ...formData, items: [] });
      return;
    }

    setFormData({
      ...formData,
      items: [
        {
          targetId: formData.accountId ?? "",
          amount: numericValue
        }
      ]
    });
  };

  const handleSetSuggestedAmount = () => {
    if (unbalancedAmount > 0) {
      setFormData({
        ...formData,
        items: [
          {
            targetId: formData.accountId ?? "",
            amount: unbalancedAmount
          }
        ]
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <BanknoteIcon className="size-4 text-muted-foreground" />
        <span>مبلغ</span>
      </div>
      <div className="space-y-2">
        <AmountInput
          id="amount"
          placeholder={unbalancedAmount ? `مبلغ پیشنهادی: ${unbalancedAmount}` : "مبلغ را وارد کنید"}
          value={currentAmount}
          onChange={handleAmountChange}
          min="0"
          step="0.01"
        />
        {unbalancedAmount > 0 && (
          <Button type="button" variant="outline" size="sm" onClick={handleSetSuggestedAmount} className="w-full">
            تخصیص مبلغ پیشنهادی ({unbalancedAmount.toLocaleString("fa-IR")})
          </Button>
        )}
      </div>
      {unbalancedAmount > 0 && (
        <p className="text-sm text-muted-foreground">
          مبلغ عدم تعادل حساب ۲۰۵۰: {unbalancedAmount.toLocaleString("fa-IR")}
        </p>
      )}
    </div>
  );
}
