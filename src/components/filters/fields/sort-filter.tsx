"use client";

import { Pills, type PillOption } from "@/components/ui/pills";
import { cn } from "@/lib/utils";

import type { SortOption } from "../types";

type SortFilterProps = {
  readonly options: readonly SortOption[];
  readonly value: string | undefined;
  readonly onChange: (value: string) => void;
  readonly className?: string;
};

export function SortFilter({ options, value, onChange, className }: SortFilterProps) {
  // Convert SortOption to PillOption format
  const pillOptions: PillOption<string>[] = options.map((option) => ({
    value: option.value,
    label: option.label,
    icon: option.icon
  }));

  const handleValueChange = (newValue: string | undefined) => {
    // Sort always requires a value, so only call onChange if we have one
    if (newValue) {
      onChange(newValue);
    }
  };

  return (
    <div className={cn(className)}>
      <Pills
        mode="single"
        variant="outline"
        size="sm"
        value={value}
        onValueChange={handleValueChange}
        options={pillOptions}
        allowDeselect={false}
      />
    </div>
  );
}
