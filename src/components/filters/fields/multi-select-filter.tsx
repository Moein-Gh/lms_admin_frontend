"use client";

import * as React from "react";
import { CheckIcon, SearchIcon } from "lucide-react";
import { motion } from "motion/react";

import { Input } from "@/components/ui/input";
import { Pills, type PillOption } from "@/components/ui/pills";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import type { MultiSelectOption } from "../types";

type MultiSelectFilterProps = {
  readonly options: readonly MultiSelectOption[];
  readonly selectedValues: string[];
  readonly onChange: (values: string[]) => void;
  readonly searchable?: boolean;
  readonly searchPlaceholder?: string;
  readonly maxHeight?: string;
  readonly className?: string;
  readonly asPills?: boolean;
};

export function MultiSelectFilter({
  options,
  selectedValues,
  onChange,
  searchable = false,
  searchPlaceholder = "جستجو...",
  maxHeight = "300px",
  className,
  asPills = false
}: MultiSelectFilterProps) {
  const [search, setSearch] = React.useState("");

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options;
    const searchLower = search.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(searchLower));
  }, [options, search]);

  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const isSelected = (value: string) => selectedValues.includes(value);

  // When asPills is true, render a Pills component (multiple mode) with optional search
  if (asPills) {
    // Convert filteredOptions to PillOption
    const pillOptions = filteredOptions.map((o) => ({ value: o.value, label: o.label, icon: o.icon }));

    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {searchable && (
          <div className="relative">
            <SearchIcon className="text-muted-foreground pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="border-input bg-background placeholder:text-muted-foreground focus:ring-ring h-10 w-full rounded-lg border ps-9 text-sm transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none"
            />
          </div>
        )}

        <div className="rounded-lg">
          {pillOptions.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">نتیجه‌ای یافت نشد</p>
          ) : (
            <ScrollArea style={{ maxHeight }} className="p-2">
              <Pills
                mode="multiple"
                options={pillOptions as PillOption<string>[]}
                value={selectedValues}
                onValueChange={(vals: string[] | undefined) => onChange(vals ?? [])}
                size="sm"
                variant="outline"
              />
            </ScrollArea>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {searchable && (
        <div className="relative">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="border-input bg-background placeholder:text-muted-foreground focus:ring-ring h-10 w-full rounded-lg border ps-9 text-sm transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none"
          />
        </div>
      )}

      <ScrollArea style={{ maxHeight }} className="rounded-lg">
        <div className="space-y-1">
          {filteredOptions.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">نتیجه‌ای یافت نشد</p>
          ) : (
            filteredOptions.map((option, index) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => handleToggle(option.value)}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02, duration: 0.15 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-3 text-start transition-colors",
                  isSelected(option.value) ? "bg-primary/10 text-primary" : "hover:bg-accent text-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                    isSelected(option.value)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30"
                  )}
                >
                  {isSelected(option.value) && <CheckIcon className="size-3.5" strokeWidth={3} />}
                </span>

                {option.icon && <span className="text-muted-foreground shrink-0">{option.icon}</span>}

                <span className="flex-1 font-medium">{option.label}</span>

                {option.count !== undefined && (
                  <span className="text-muted-foreground text-xs">{option.count.toLocaleString("fa-IR")}</span>
                )}
              </motion.button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
