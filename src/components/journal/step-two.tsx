import * as React from "react";
import type { AllocationFormData } from "@/components/journal/allocate-journal-panel.types";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function StepTwo({
  formData,
  setFormData,
  targetLabel,
  targetList
}: {
  formData: Partial<AllocationFormData>;
  setFormData: (data: Partial<AllocationFormData>) => void;
  targetLabel: string;
  targetList: readonly { id: string; name?: string; code?: number }[];
}) {
  const selectedId = formData.items && formData.items.length > 0 ? formData.items[0].targetId : "";

  const handleSelect = (value: string) => {
    const existingAmount = formData.items && formData.items.length > 0 ? formData.items[0].amount : 0;
    setFormData({ ...formData, items: [{ targetId: value, amount: existingAmount }] });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="target">{targetLabel}</Label>
      <Select value={selectedId} onValueChange={handleSelect}>
        <SelectTrigger id="target">
          <SelectValue placeholder={targetLabel} />
        </SelectTrigger>
        <SelectContent>
          {targetList.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name ?? `کد: ${item.code ?? item.id}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
