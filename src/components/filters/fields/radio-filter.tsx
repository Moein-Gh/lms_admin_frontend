"use client";

import { Pills, type PillOption } from "@/components/ui/pills";
import { cn } from "@/lib/utils";

import type { MultiSelectOption } from "../types";

type RadioFilterFieldProps = {
  readonly options: readonly MultiSelectOption[];
  readonly value: string | undefined;
  readonly onChange: (value: string | undefined) => void;
  readonly showAll?: boolean;
  readonly allLabel?: string;
  readonly className?: string;
};

export function RadioFilterField({
  options,
  value,
  onChange,
  showAll = true,
  allLabel = "همه",
  className
}: RadioFilterFieldProps) {
  // Convert MultiSelectOption to PillOption format
  const pillOptions: PillOption<string>[] = options.map((option) => ({
    value: option.value,
    label: option.label,
    icon: option.icon
  }));

  // Add "All" option if showAll is true
  const allOptions = showAll ? [{ value: "__all__", label: allLabel }, ...pillOptions] : pillOptions;

  const handleValueChange = (newValue: string | undefined) => {
    // Convert "__all__" back to undefined
    onChange(newValue === "__all__" ? undefined : newValue);
  };

  // Convert undefined to "__all__" for the Pills component
  const pillValue = value ?? "__all__";

  return (
    <div dir="rtl" className={cn(className)}>
      <Pills
        mode="single"
        variant="outline"
        size="sm"
        value={pillValue}
        onValueChange={handleValueChange}
        options={allOptions}
        allowDeselect={false}
      />
    </div>
  );
}
