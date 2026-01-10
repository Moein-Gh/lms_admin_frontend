"use client";

import * as React from "react";
import { ArrowRightIcon, ArrowUpDownIcon, ChevronLeftIcon, SlidersHorizontalIcon } from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

import { DateRangeFilter, MultiSelectFilter, RadioFilterField, RangeFilter, SearchFilter, SortFilter } from "./fields";
import type { EntityFilterConfig, FilterField, FilterState, FilterValue, MobileFilterView } from "./types";

type MobileFilterDrawerProps<TFilters extends FilterState> = {
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
      return (
        <MultiSelectFilter
          options={field.options}
          selectedValues={selectedValues}
          onChange={onChange}
          searchable={field.searchable}
          searchPlaceholder={field.searchPlaceholder}
          maxHeight="calc(100vh - 350px)"
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

export function MobileFilterDrawer<TFilters extends FilterState>({
  open,
  onOpenChange,
  config,
  filters,
  onFiltersChange,
  onReset,
  resultCount
}: MobileFilterDrawerProps<TFilters>) {
  const [view, setView] = React.useState<MobileFilterView>("categories");
  const [localFilters, setLocalFilters] = React.useState<TFilters>(filters);

  // Sync local filters with prop when drawer opens
  React.useEffect(() => {
    if (open) {
      setLocalFilters(filters);
      setView("categories");
    }
  }, [open, filters]);

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

  const handleNavigateToDetail = (fieldKey: string) => {
    setView({ type: "detail", fieldKey });
  };

  const handleBack = () => {
    setView("categories");
  };

  const searchKey = config.search?.key;
  const getSearchValue = (): string => {
    if (!searchKey || !(searchKey in localFilters)) return "";
    const val = localFilters[searchKey as keyof typeof localFilters];
    return typeof val === "string" ? val : "";
  };
  const searchValue = getSearchValue();

  // Calculate total active filters
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;

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
  }, [localFilters, config, searchKey]);

  const currentField = view !== "categories" ? config.filters.find((f) => f.key === view.fieldKey) : null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex max-h-[96dvh] flex-col">
        {/* Header */}
        <DrawerHeader className="border-border shrink-0 border-b text-start group-data-[vaul-drawer-direction=bottom]/drawer-content:text-start group-data-[vaul-drawer-direction=top]/drawer-content:text-start">
          {view === "categories" ? (
            <motion.div
              key="cat-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <DrawerTitle>{config.title}</DrawerTitle>
              <DrawerDescription>{config.description}</DrawerDescription>
            </motion.div>
          ) : (
            <motion.div
              key="detail-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <button
                type="button"
                onClick={handleBack}
                className="hover:bg-accent flex size-9 items-center justify-center rounded-lg transition-colors"
                aria-label="بازگشت"
              >
                <ArrowRightIcon className="size-5" />
              </button>
              <div className="flex-1">
                <DrawerTitle>{view.fieldKey === "__sort__" ? "مرتب‌سازی" : (currentField?.label ?? "")}</DrawerTitle>
              </div>
            </motion.div>
          )}
        </DrawerHeader>

        {/* Body - Animated content */}
        <DrawerBody className="flex-1 overflow-auto p-0">
          {view === "categories" ? (
            <motion.div key="cat-body" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <ScrollArea className="h-full">
                <div className="space-y-2 p-4">
                  {/* Search */}
                  {config.search && searchKey && (
                    <div className="pb-2">
                      <SearchFilter
                        value={searchValue}
                        onChange={(v) => handleFieldChange(searchKey, v || undefined)}
                        placeholder={config.search.placeholder}
                        size="lg"
                      />
                    </div>
                  )}

                  {/* Sort - Always first category */}
                  {config.sort && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05, duration: 0.2 }}
                    >
                      <CategoryItem
                        icon={<ArrowUpDownIcon className="size-5" />}
                        label="مرتب‌سازی"
                        selectedCount={
                          localFilters[config.sort.key] && localFilters[config.sort.key] !== config.sort.defaultValue
                            ? 1
                            : 0
                        }
                        onClick={() => handleNavigateToDetail("__sort__")}
                      />
                    </motion.div>
                  )}

                  {/* Filter Categories */}
                  {config.filters.map((field, index) => {
                    const value = localFilters[field.key];
                    const count = getSelectedCount(field, value);

                    return (
                      <motion.div
                        key={field.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05, duration: 0.2 }}
                      >
                        <CategoryItem
                          icon={field.icon ?? <SlidersHorizontalIcon className="size-5" />}
                          label={field.label}
                          selectedCount={count}
                          onClick={() => handleNavigateToDetail(field.key)}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollArea>
            </motion.div>
          ) : (
            <motion.div
              key="detail-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ScrollArea className="h-full">
                <div className="p-4">
                  {view.fieldKey === "__sort__" && config.sort ? (
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
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </DrawerBody>

        {/* Footer - Sticky */}
        <DrawerFooter className="border-border shrink-0 border-t">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              پاک کردن همه
            </Button>
            <Button onClick={handleApply} className="flex-1">
              {resultCount !== undefined ? `نمایش ${resultCount.toLocaleString("fa-IR")} نتیجه` : `اعمال فیلترها`}
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="me-2 size-5 p-0">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// Category item component
function CategoryItem({
  icon,
  label,
  selectedCount,
  onClick
}: {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly selectedCount: number;
  readonly onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="bg-card hover:bg-accent flex w-full items-center gap-4 rounded-xl border p-4 text-start transition-colors"
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1 font-medium">{label}</span>
      {selectedCount > 0 && (
        <Badge variant="default" className="size-6 p-0">
          {selectedCount}
        </Badge>
      )}
      <ChevronLeftIcon className="text-muted-foreground size-5" />
    </motion.button>
  );
}
