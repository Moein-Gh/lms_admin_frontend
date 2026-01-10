"use client";

import { CheckIcon } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type RadioOption = {
  readonly value: string;
  readonly label: string;
};

type RadioFilterProps = {
  readonly value: string | undefined;
  readonly onChange: (value: string | undefined) => void;
  readonly options: readonly RadioOption[];
  readonly allLabel?: string;
  readonly showAll?: boolean;
  readonly className?: string;
};

export function RadioFilter({
  value,
  onChange,
  options,
  allLabel = "همه",
  showAll = true,
  className
}: RadioFilterProps) {
  const handleSelect = (optionValue: string | undefined) => {
    onChange(optionValue);
  };

  const allOptions: readonly RadioOption[] = showAll ? [{ value: "__all__", label: allLabel }, ...options] : options;

  return (
    <div className={cn("space-y-1", className)}>
      {allOptions.map((option, index) => {
        const optionValue = option.value === "__all__" ? undefined : option.value;
        const isSelected = value === optionValue;

        return (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => handleSelect(optionValue)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03, duration: 0.15 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg p-3 text-start transition-colors",
              isSelected ? "bg-primary/10 text-primary" : "hover:bg-accent text-foreground"
            )}
          >
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
              )}
            >
              {isSelected && <CheckIcon className="size-3" strokeWidth={3} />}
            </span>

            <span className="flex-1 font-medium ">{option.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
