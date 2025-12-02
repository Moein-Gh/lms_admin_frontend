import * as React from "react";
import { BanknoteIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <BanknoteIcon className="size-4 text-muted-foreground" />
        <span>مبلغ</span>
      </div>
      <Input
        id="amount"
        type="number"
        placeholder={unbalancedAmount ? `مبلغ پیشنهادی: ${unbalancedAmount}` : "مبلغ را وارد کنید"}
        value={formData.amount ?? ""}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        min="0"
        step="0.01"
      />
      {unbalancedAmount > 0 && (
        <p className="text-sm text-muted-foreground">
          مبلغ عدم تعادل حساب ۲۰۵۰: {unbalancedAmount.toLocaleString("fa-IR")}
        </p>
      )}
    </div>
  );
}
