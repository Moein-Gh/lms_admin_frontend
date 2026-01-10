"use client";

import * as React from "react";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import { XIcon } from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { EntityFilterConfig, FilterField, FilterState, FilterValue } from "./types";

type ActiveFiltersProps<TFilters extends FilterState> = {
  readonly config: EntityFilterConfig<TFilters>;
  readonly filters: TFilters;
  readonly onFiltersChange: (filters: TFilters) => void;
  readonly onReset: () => void;
  readonly className?: string;
};

// Get display value for a filter
function getFilterDisplayValue(field: FilterField, value: FilterValue): string | null {
  if (value === undefined) return null;

  switch (field.type) {
    case "multi-select": {
      if (!Array.isArray(value) || value.length === 0) return null;
      const selectedLabels = value
        .map((v) => {
          const option = field.options.find((opt) => opt.value === v);
          return option?.label;
        })
        .filter(Boolean);
      return selectedLabels.length > 0 ? selectedLabels.join("، ") : null;
    }

    case "radio": {
      if (!value) return null;
      const option = field.options.find((opt) => opt.value === value);
      return option?.label ?? null;
    }

    case "range": {
      if (!Array.isArray(value) || value.length !== 2) return null;
      const [min, max] = value as [number, number];
      if (min === field.min && max === field.max) return null;

      const formatFn = field.formatValue ?? ((v: number) => v.toLocaleString("fa-IR"));
      if (min !== field.min && max !== field.max) {
        return `${formatFn(min)} تا ${formatFn(max)}`;
      }
      if (min !== field.min) {
        return `از ${formatFn(min)}`;
      }
      if (max !== field.max) {
        return `تا ${formatFn(max)}`;
      }
      return null;
    }

    case "date-range": {
      if (!Array.isArray(value) || value.length !== 2) return null;
      const [from, to] = value as [Date, Date];

      const fromStr = format(from, "d MMM yyyy", { locale: faIR });
      const toStr = format(to, "d MMM yyyy", { locale: faIR });
      return `${fromStr} تا ${toStr}`;
    }

    default:
      return null;
  }
}

// Check if a filter is active
function isFilterActive(field: FilterField, value: FilterValue): boolean {
  if (value === undefined) return false;

  switch (field.type) {
    case "multi-select":
      return Array.isArray(value) && value.length > 0;
    case "radio":
      return !!value;
    case "range": {
      if (!Array.isArray(value) || value.length !== 2) return false;
      const [min, max] = value as [number, number];
      return min !== field.min || max !== field.max;
    }
    case "date-range": {
      return Array.isArray(value) && value.length === 2 && !!value[0] && !!value[1];
    }
    default:
      return false;
  }
}

export function ActiveFilters<TFilters extends FilterState>({
  config,
  filters,
  onFiltersChange,
  onReset,
  className
}: ActiveFiltersProps<TFilters>) {
  // Collect all active filters
  const activeFilters = React.useMemo(() => {
    const items: Array<{
      key: string;
      label: string;
      displayValue: string;
      field: FilterField;
    }> = [];

    // Check search
    const searchKey = config.search?.key;
    if (searchKey && searchKey in filters) {
      const searchVal = filters[searchKey as keyof typeof filters];
      if (searchVal && typeof searchVal === "string") {
        items.push({
          key: searchKey,
          label: config.search.placeholder,
          displayValue: searchVal,
          field: { type: "search", key: searchKey, placeholder: "", label: "" } as unknown as FilterField
        });
      }
    }

    // Check sort
    if (config.sort && filters[config.sort.key] !== config.sort.defaultValue) {
      const sortVal = filters[config.sort.key];
      const sortOption = config.sort.options.find((opt) => opt.value === sortVal);
      if (sortOption) {
        items.push({
          key: config.sort.key,
          label: "مرتب‌سازی",
          displayValue: sortOption.label,
          field: { type: "sort", key: config.sort.key, label: "" } as unknown as FilterField
        });
      }
    }

    // Check filters
    config.filters.forEach((field) => {
      const value = filters[field.key];
      if (isFilterActive(field, value)) {
        const displayValue = getFilterDisplayValue(field, value);
        if (displayValue) {
          items.push({
            key: field.key,
            label: field.label,
            displayValue,
            field
          });
        }
      }
    });

    return items;
  }, [config, filters]);

  const handleRemoveFilter = (key: string) => {
    const field = config.filters.find((f) => f.key === key);
    let resetValue: FilterValue;

    if (key === config.search?.key) {
      resetValue = undefined;
    } else if (config.sort && key === config.sort.key) {
      resetValue = config.sort.defaultValue;
    } else if (field) {
      switch (field.type) {
        case "multi-select":
          resetValue = [];
          break;
        case "radio":
          resetValue = undefined;
          break;
        case "date-range":
          resetValue = undefined;
          break;
        case "range":
          resetValue = [field.min, field.max];
          break;
        default:
          resetValue = undefined;
      }
    } else {
      resetValue = undefined;
    }

    onFiltersChange({
      ...filters,
      [key]: resetValue
    });
  };

  if (activeFilters.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      <span className="text-muted-foreground text-sm font-medium">فیلترهای فعال:</span>

      {activeFilters.map((filter, index) => (
        <motion.div
          key={filter.key}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: index * 0.05 }}
        >
          <Badge variant="secondary" className="gap-2 py-1.5 pe-1.5 ps-3 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="text-muted-foreground font-normal">{filter.label}:</span>
              <span className="font-medium">{filter.displayValue}</span>
            </span>
            <button
              type="button"
              onClick={() => handleRemoveFilter(filter.key)}
              className="hover:bg-muted-foreground/20 -me-0.5 flex size-4 items-center justify-center rounded-full transition-colors"
              aria-label={`حذف فیلتر ${filter.label}`}
            >
              <XIcon className="size-3" />
            </button>
          </Badge>
        </motion.div>
      ))}

      {activeFilters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground h-7 text-xs"
        >
          پاک کردن همه
        </Button>
      )}
    </motion.div>
  );
}
