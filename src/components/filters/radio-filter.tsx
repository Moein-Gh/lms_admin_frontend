"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioFilterProps {
  value?: string;
  onChange: (value?: string) => void;
  options: RadioOption[];
  allLabel?: string;
  showAll?: boolean;
}

export function RadioFilter({ value, onChange, options, allLabel = "همه", showAll = true }: RadioFilterProps) {
  return (
    <RadioGroup
      value={value ?? "all"}
      onValueChange={(val) => {
        onChange(val === "all" ? undefined : val);
      }}
    >
      {showAll && (
        <>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="all" id="radio-all" />
            <Label htmlFor="radio-all" className="font-normal">
              {allLabel}
            </Label>
          </div>
          <Separator className="my-2" />
        </>
      )}
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2 space-x-reverse">
          <RadioGroupItem value={option.value} id={`radio-${option.value}`} />
          <Label htmlFor={`radio-${option.value}`} className="font-normal">
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
