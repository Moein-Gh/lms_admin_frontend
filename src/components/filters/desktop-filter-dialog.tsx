"use client";

import * as React from "react";
import { ArrowUpDownIcon, SlidersHorizontalIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { DateRangeFilter, MultiSelectFilter, RadioFilterField, RangeFilter, SearchFilter, SortFilter } from "./fields";
import type { EntityFilterConfig, FilterField, FilterState, FilterValue, MultiSelectFilterField } from "./types";

type DesktopFilterDialogProps<TFilters extends FilterState> = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly config: EntityFilterConfig<TFilters>;
  readonly filters: TFilters;
  readonly onFiltersChange: (filters: TFilters) => void;
  readonly onReset: () => void;
  readonly resultCount?: number;
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

// Render filter content based on field type
function FilterContent({
  field,
  value,
  onChange
}: {
  readonly field: FilterField;
  readonly value: FilterValue;
  readonly onChange: (newValue: FilterValue) => void;
}) {
  switch (field.type) {
    case "multi-select": {
      const selectedValues = Array.isArray(value) && value.every((v) => typeof v === "string") ? value : [];
      // Cast-safe check for multi-select field to read `asPills`
      const isMulti = (f: FilterField): f is MultiSelectFilterField => f.type === "multi-select";
      const asPills = isMulti(field) ? field.asPills : undefined;
      return (
        <MultiSelectFilter
          options={field.options}
          selectedValues={selectedValues}
          onChange={onChange}
          searchable={field.searchable}
          searchPlaceholder={field.searchPlaceholder}
          maxHeight="400px"
          asPills={asPills}
        />
      );
    }

    case "radio":
      return (
        <RadioFilterField
          options={field.options}
          value={typeof value === "string" ? value : undefined}
          onChange={onChange}
          showAll={field.showAll}
          allLabel={field.allLabel}
        />
      );

    case "range":
      return (
        <RangeFilter
          min={field.min}
          max={field.max}
          step={field.step}
          value={Array.isArray(value) && value.length === 2 ? (value as [number, number]) : [field.min, field.max]}
          onChange={onChange}
          formatValue={field.formatValue}
          histogram={field.histogram}
        />
      );

    case "date-range":
      return (
        <DateRangeFilter
          value={Array.isArray(value) && value.length === 2 ? (value as [Date, Date]) : undefined}
          onChange={onChange}
          minDate={field.minDate}
          maxDate={field.maxDate}
          presets={field.presets}
        />
      );

    default:
      return null;
  }
}

// Animation variants
const contentVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export function DesktopFilterDialog<TFilters extends FilterState>({
  open,
  onOpenChange,
  config,
  filters,
  onFiltersChange,
  onReset
}: DesktopFilterDialogProps<TFilters>) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("__sort__");
  const [localFilters, setLocalFilters] = React.useState<TFilters>(filters);

  // Build list of all categories (sort + filters)
  const categories = React.useMemo(() => {
    const items: { key: string; label: string; icon: React.ReactNode; count: number }[] = [];

    // Add sort as first category if exists
    if (config.sort) {
      const sortValue = localFilters[config.sort.key];
      const hasCustomSort = sortValue && sortValue !== config.sort.defaultValue;
      items.push({
        key: "__sort__",
        label: "مرتب‌سازی",
        icon: <ArrowUpDownIcon className="size-4" />,
        count: hasCustomSort ? 1 : 0
      });
    }

    // Add filter categories
    config.filters.forEach((field) => {
      const value = localFilters[field.key];
      const count = getSelectedCount(field, value);
      items.push({
        key: field.key,
        label: field.label,
        icon: field.icon ?? <SlidersHorizontalIcon className="size-4" />,
        count
      });
    });

    return items;
  }, [config, localFilters]);

  // Sync local filters with prop when dialog opens
  React.useEffect(() => {
    if (open) {
      setLocalFilters(filters);
      // Select first category by default
      if (config.sort) {
        setSelectedCategory("__sort__");
      } else if (config.filters.length > 0) {
        setSelectedCategory(config.filters[0].key);
      }
    }
  }, [open, filters, config]);

  const handleFieldChange = (key: string, value: FilterValue) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    onReset();
    onOpenChange(false);
  };

  // Calculate total active filters
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;

    const searchKey = config.search?.key;
    if (searchKey && searchKey in localFilters) {
      const searchVal = localFilters[searchKey as keyof typeof localFilters];
      if (searchVal) count += 1;
    }

    if (config.sort?.key && localFilters[config.sort.key] !== config.sort.defaultValue) {
      count += 1;
    }

    config.filters.forEach((field) => {
      const value = localFilters[field.key];
      count += getSelectedCount(field, value);
    });

    return count;
  }, [localFilters, config]);

  const currentField = config.filters.find((f) => f.key === selectedCategory);
  const searchKey = config.search?.key;
  const getSearchValue = (): string => {
    if (!searchKey || !(searchKey in localFilters)) return "";
    const val = localFilters[searchKey as keyof typeof localFilters];
    return typeof val === "string" ? val : "";
  };
  const searchValue = getSearchValue();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        showCloseButton={false}
        className="flex max-h-[90vh] w-250 max-w-[95vw] sm:max-w-none flex-col gap-0 overflow-hidden p-0"
      >
        {/* Header */}
        <DialogHeader className="border-border shrink-0 border-b px-6 py-4 text-right">
          <div>
            <DialogTitle>{config.title}</DialogTitle>
            {config.description && <DialogDescription>{config.description}</DialogDescription>}
          </div>
        </DialogHeader>

        {/* Main content - RTL: sidebar must be first so it sits on the right */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Filter categories */}
          <div className="bg-muted/30 border-border flex w-64 shrink-0 flex-col border-e shadow-sm h-full min-h-0">
            {/* Search in sidebar if configured */}
            {config.search && searchKey && (
              <div className="border-border shrink-0 border-b p-3">
                <SearchFilter
                  value={searchValue}
                  onChange={(v) => handleFieldChange(searchKey, v || undefined)}
                  placeholder={config.search.placeholder}
                  size="default"
                />
              </div>
            )}

            {/* Category list */}
            <ScrollArea className="flex-1 min-h-0">
              <nav className="space-y-1 p-2 ">
                {categories.map((category, index) => (
                  <motion.button
                    key={category.key}
                    type="button"
                    onClick={() => setSelectedCategory(category.key)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    dir="rtl"
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm transition-colors",
                      selectedCategory === category.key
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <span className="shrink-0">{category.icon}</span>
                    <span className="flex-1 truncate">{category.label}</span>
                    {category.count > 0 && (
                      <Badge
                        variant={selectedCategory === category.key ? "default" : "secondary"}
                        className="size-5 shrink-0 p-0 text-xs"
                      >
                        {category.count}
                      </Badge>
                    )}
                  </motion.button>
                ))}
              </nav>
            </ScrollArea>
          </div>

          {/* Content area - Filter options */}
          <div className="flex min-w-0 flex-1 flex-col h-full min-h-0">
            <ScrollArea className="flex-1 overflow-auto min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory}
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="p-6 min-h-0 text-right"
                >
                  {/* Title of selected category */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-right ">
                      {selectedCategory === "__sort__" ? "مرتب‌سازی" : (currentField?.label ?? "")}
                    </h3>
                    {currentField?.description && (
                      <p className="text-muted-foreground mt-1 text-sm">{currentField.description}</p>
                    )}
                  </div>

                  {/* Filter content */}
                  {selectedCategory === "__sort__" && config.sort ? (
                    <SortFilter
                      options={config.sort.options}
                      value={localFilters[config.sort.key] as string | undefined}
                      onChange={(v) => {
                        if (config.sort) {
                          handleFieldChange(config.sort.key, v);
                        }
                      }}
                    />
                  ) : currentField ? (
                    <FilterContent
                      field={currentField}
                      value={localFilters[currentField.key]}
                      onChange={(v) => handleFieldChange(currentField.key, v)}
                    />
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="border-border shrink-0 border-t px-6 py-4">
          <div className="flex w-full items-center justify-between gap-4">
            <Button variant="ghost" onClick={handleReset}>
              پاک کردن همه
            </Button>

            <div className="flex items-center gap-2">
              <Button onClick={handleApply}>
                نمایش نتایج
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="me-2 size-5 p-0">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                انصراف
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
