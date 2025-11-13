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
  return (
    <div className="space-y-2">
      <Label htmlFor="target">{targetLabel}</Label>
      <Select value={formData.targetId} onValueChange={(value) => setFormData({ ...formData, targetId: value })}>
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
