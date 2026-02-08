"use client";

import * as React from "react";
import { SlidersHorizontalIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/general/use-mobile";

import { DesktopFilterDialog } from "./desktop-filter-dialog";
import { MobileFilterDrawer } from "./mobile-filter-drawer";
import type { EntityFilterConfig, FilterField, FilterState, FilterValue } from "./types";

type EntityFilterProps<TFilters extends FilterState> = {
  readonly config: EntityFilterConfig<TFilters>;
  readonly filters: TFilters;
  readonly onFiltersChange: (filters: TFilters) => void;
  readonly onReset: () => void;
  readonly resultCount?: number;
  readonly triggerVariant?: "default" | "outline" | "ghost";
  readonly triggerLabel?: string;
  readonly showBadge?: boolean;
  readonly className?: string;
};

// Get selected count for a filter field
function getSelectedCount(field: FilterField, value: FilterValue): number {
  if (value === undefined) return 0;

  switch (field.type) {
    case "multi-select":
      return Array.isArray(value) ? value.length : 0;
    case "radio":
      return value ? 1 : 0;
    case "range": {
      if (!Array.isArray(value) || value.length !== 2) return 0;
      const [min, max] = value as [number, number];
      return min !== field.min || max !== field.max ? 1 : 0;
    }
    default:
      return 0;
  }
}

export function EntityFilter<TFilters extends FilterState>({
  config,
  filters,
  onFiltersChange,
  onReset,
  resultCount,
  triggerVariant = "outline",
  triggerLabel = "فیلترها",
  showBadge = true,
  className
}: EntityFilterProps<TFilters>) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  // Calculate total active filters count
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;

    const searchKey = config.search?.key;
    if (searchKey && searchKey in filters) {
      const searchVal = filters[searchKey as keyof typeof filters];
      if (searchVal) count += 1;
    }

    if (config.sort?.key && filters[config.sort.key] !== config.sort.defaultValue) {
      count += 1;
    }

    config.filters.forEach((field) => {
      const value = filters[field.key];
      count += getSelectedCount(field, value);
    });

    return count;
  }, [filters, config]);

  return (
    <>
      {/* Trigger Button */}
      <Button variant={triggerVariant} onClick={() => setOpen(true)} className={className}>
        <SlidersHorizontalIcon className="size-4" />
        {triggerLabel}
        {showBadge && activeFiltersCount > 0 && (
          <Badge variant="default" className="me-2 size-5 p-0">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      {/* Mobile: Drawer / Desktop: Dialog */}
      {isMobile ? (
        <MobileFilterDrawer
          open={open}
          onOpenChange={setOpen}
          config={config}
          filters={filters}
          onFiltersChange={onFiltersChange}
          onReset={onReset}
          resultCount={resultCount}
        />
      ) : (
        <DesktopFilterDialog
          open={open}
          onOpenChange={setOpen}
          config={config}
          filters={filters}
          onFiltersChange={onFiltersChange}
          onReset={onReset}
          resultCount={resultCount}
        />
      )}
    </>
  );
}
