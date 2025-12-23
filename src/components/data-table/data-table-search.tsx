"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";

interface DataTableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function DataTableSearch({ value, onChange, placeholder }: DataTableSearchProps) {
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localValue, onChange, value]);

  return (
    <Input
      placeholder={placeholder ?? "جستجو..."}
      value={localValue}
      onChange={(event) => setLocalValue(event.target.value)}
      className="h-8 w-[150px] lg:w-[250px]"
    />
  );
}
