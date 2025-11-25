"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const pillsContainerVariants = cva("flex flex-wrap items-center gap-2", {
  variants: {
    size: {
      default: "gap-2",
      sm: "gap-1.5",
      lg: "gap-3"
    }
  },
  defaultVariants: {
    size: "default"
  }
});

const pillItemVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border text-sm font-medium transition-all select-none cursor-pointer outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:border-primary data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",
        outline:
          "border-input bg-transparent text-foreground hover:bg-accent/50 data-[selected=true]:border-primary data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",
        ghost:
          "border-transparent bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[selected=true]:border-accent"
      },
      size: {
        default: "h-8 px-3.5 py-1.5",
        sm: "h-7 px-2.5 py-1 text-xs",
        lg: "h-9 px-4 py-2"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

type PillOption<T extends string = string> = {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
};

type PillsBaseProps<T extends string = string> = VariantProps<typeof pillsContainerVariants> &
  VariantProps<typeof pillItemVariants> & {
    options: PillOption<T>[];
    disabled?: boolean;
    className?: string;
    itemClassName?: string;
  };

type PillsSingleProps<T extends string = string> = PillsBaseProps<T> & {
  mode?: "single";
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T | undefined) => void;
  allowDeselect?: boolean;
  min?: never;
  max?: never;
};

type PillsMultipleProps<T extends string = string> = PillsBaseProps<T> & {
  mode: "multiple";
  value?: T[];
  defaultValue?: T[];
  onValueChange?: (value: T[]) => void;
  min?: number;
  max?: number;
  allowDeselect?: never;
};

type PillsProps<T extends string = string> = PillsSingleProps<T> | PillsMultipleProps<T>;

function Pills<T extends string = string>({
  options,
  variant,
  size,
  disabled = false,
  className,
  itemClassName,
  ...props
}: PillsProps<T>) {
  const isMultiple = props.mode === "multiple";

  // Single mode state
  const [singleValue, setSingleValue] = React.useState<T | undefined>(
    !isMultiple ? (props as PillsSingleProps<T>).defaultValue : undefined
  );

  // Multiple mode state
  const [multipleValue, setMultipleValue] = React.useState<T[]>(
    isMultiple ? ((props as PillsMultipleProps<T>).defaultValue ?? []) : []
  );

  // Controlled vs uncontrolled handling
  const currentSingleValue = !isMultiple ? ((props as PillsSingleProps<T>).value ?? singleValue) : undefined;

  const currentMultipleValue = isMultiple ? ((props as PillsMultipleProps<T>).value ?? multipleValue) : [];

  const handleSingleSelect = React.useCallback(
    (optionValue: T) => {
      if (disabled) return;

      const singleProps = props as PillsSingleProps<T>;
      const allowDeselect = singleProps.allowDeselect ?? true;

      let newValue: T | undefined;

      if (currentSingleValue === optionValue) {
        newValue = allowDeselect ? undefined : currentSingleValue;
      } else {
        newValue = optionValue;
      }

      if (singleProps.value === undefined) {
        setSingleValue(newValue);
      }

      singleProps.onValueChange?.(newValue);
    },
    [disabled, props, currentSingleValue]
  );

  const handleMultipleSelect = React.useCallback(
    (optionValue: T) => {
      if (disabled) return;

      const multipleProps = props as PillsMultipleProps<T>;
      const min = multipleProps.min ?? 0;
      const max = multipleProps.max ?? Infinity;

      let newValue: T[];

      if (currentMultipleValue.includes(optionValue)) {
        // Trying to deselect
        if (currentMultipleValue.length <= min) {
          // Can't deselect if at minimum
          return;
        }
        newValue = currentMultipleValue.filter((v) => v !== optionValue);
      } else {
        // Trying to select
        if (currentMultipleValue.length >= max) {
          // Can't select more if at maximum
          return;
        }
        newValue = [...currentMultipleValue, optionValue];
      }

      if (multipleProps.value === undefined) {
        setMultipleValue(newValue);
      }

      multipleProps.onValueChange?.(newValue);
    },
    [disabled, props, currentMultipleValue]
  );

  const isSelected = React.useCallback(
    (optionValue: T): boolean => {
      if (isMultiple) {
        return currentMultipleValue.includes(optionValue);
      }
      return currentSingleValue === optionValue;
    },
    [isMultiple, currentSingleValue, currentMultipleValue]
  );

  const isItemDisabled = React.useCallback(
    (option: PillOption<T>): boolean => {
      if (disabled || option.disabled) return true;

      if (isMultiple) {
        const multipleProps = props as PillsMultipleProps<T>;
        const max = multipleProps.max ?? Infinity;
        const min = multipleProps.min ?? 0;

        // Disable selection if at max and item is not selected
        if (!currentMultipleValue.includes(option.value) && currentMultipleValue.length >= max) {
          return true;
        }

        // Disable deselection if at min and item is selected
        if (currentMultipleValue.includes(option.value) && currentMultipleValue.length <= min) {
          return true;
        }
      }

      return false;
    },
    [disabled, isMultiple, props, currentMultipleValue]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, optionValue: T, optionDisabled: boolean) => {
      if (optionDisabled) return;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (isMultiple) {
          handleMultipleSelect(optionValue);
        } else {
          handleSingleSelect(optionValue);
        }
      }
    },
    [isMultiple, handleMultipleSelect, handleSingleSelect]
  );

  return (
    <div
      data-slot="pills"
      data-mode={isMultiple ? "multiple" : "single"}
      data-disabled={disabled || undefined}
      role={isMultiple ? "group" : "radiogroup"}
      aria-label="انتخاب گزینه"
      className={cn(pillsContainerVariants({ size }), className)}
    >
      {options.map((option) => {
        const selected = isSelected(option.value);
        const itemDisabled = isItemDisabled(option);

        return (
          <button
            key={option.value}
            type="button"
            role={isMultiple ? "checkbox" : "radio"}
            aria-checked={selected}
            data-slot="pill-item"
            data-selected={selected}
            data-disabled={itemDisabled || undefined}
            disabled={itemDisabled}
            onClick={() => {
              if (isMultiple) {
                handleMultipleSelect(option.value);
              } else {
                handleSingleSelect(option.value);
              }
            }}
            onKeyDown={(e) => handleKeyDown(e, option.value, itemDisabled)}
            className={cn(pillItemVariants({ variant, size }), itemDisabled && "cursor-not-allowed", itemClassName)}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

Pills.displayName = "Pills";

export { Pills, pillsContainerVariants, pillItemVariants };
export type { PillsProps, PillOption, PillsSingleProps, PillsMultipleProps };
