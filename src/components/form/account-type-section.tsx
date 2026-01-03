import * as React from "react";
import { Label } from "@/components/ui/label";
import type { PillOption } from "@/components/ui/pills";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type Props = {
  options: PillOption<string>[];
  value: string | undefined;
  onChange: (val: string | undefined) => void;
  error?: boolean;
};

export function AccountTypeSection({ options, value, onChange, error }: Props) {
  React.useEffect(() => {
    if (options.length > 0 && (value === undefined || value === "")) {
      onChange(options[0].value);
    }
  }, [options, value, onChange]);

  return (
    <div className="space-y-2">
      <Label htmlFor="atype" className="text-sm font-medium">
        نوع حساب
        <span className="text-destructive">*</span>
      </Label>
      <Select dir="rtl" onValueChange={(v) => onChange(v || undefined)} defaultValue={value ? options[0]?.value : ""}>
        <SelectTrigger className="w-full text-right">
          <SelectValue placeholder="انتخاب نوع حساب" />
        </SelectTrigger>
        <SelectContent dir="rtl" className="text-right">
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-right">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
    </div>
  );
}
