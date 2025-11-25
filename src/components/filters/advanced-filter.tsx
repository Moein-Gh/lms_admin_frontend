"use client";

import * as React from "react";

import { FilterIcon, SearchIcon, SparklesIcon, XIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerClose, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { ResponsivePanel } from "@/components/ui/responsive-panel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Base filter type - extend this for your specific filters
export interface BaseFilters {
  search: string;
  [key: string]: string | number | boolean | undefined;
}

// Quick filter preset
export interface QuickFilter<T extends BaseFilters> {
  label: string;
  filters: Partial<T>;
}

// Filter tab configuration
export interface FilterTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

// Active filter display
export interface ActiveFilter {
  key: string;
  label: string;
}

// Main component props
export interface AdvancedFilterProps<T extends BaseFilters> {
  // Trigger button
  triggerLabel?: string;
  triggerIcon?: React.ReactNode;

  // Dialog/Drawer headers
  title?: string;
  description?: string;

  // Filter state
  filters: T;
  onFiltersChange: (filters: T) => void;
  onReset: () => void;

  // Quick filters (optional)
  quickFilters?: QuickFilter<T>[];

  // Advanced filter tabs
  tabs: FilterTab[];

  // Active filters display (optional)
  getActiveFilters?: (filters: T) => ActiveFilter[];

  // Custom search placeholder
  searchPlaceholder?: string;

  // Hide search if not needed
  hideSearch?: boolean;
}

function SearchBar<T extends BaseFilters>({
  localFilters,
  setLocalFilters,
  searchFocused,
  setSearchFocused,
  searchPlaceholder,
  quickFilters,
  applyQuickFilter,
  hideSearch
}: {
  localFilters: T;
  setLocalFilters: React.Dispatch<React.SetStateAction<T>>;
  searchFocused: boolean;
  setSearchFocused: React.Dispatch<React.SetStateAction<boolean>>;
  searchPlaceholder: string;
  quickFilters: QuickFilter<T>[];
  applyQuickFilter: (quickFilter: QuickFilter<T>) => void;
  hideSearch: boolean;
}) {
  if (hideSearch) return null;
  return (
    <div className="space-y-3 px-4">
      <div className="relative">
        <SparklesIcon
          className={cn(
            "absolute start-4 top-1/2 size-6 -translate-y-1/2 transition-colors",
            searchFocused ? "text-primary" : "text-muted-foreground"
          )}
        />
        <Input
          placeholder={searchPlaceholder}
          value={localFilters.search}
          onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="h-16 ps-14 text-lg"
        />
      </div>
      {quickFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <Badge
              key={filter.label}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => applyQuickFilter(filter)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function ActiveFiltersDisplay({
  activeFilters,
  removeFilter
}: {
  activeFilters: ActiveFilter[];
  removeFilter: (key: string) => void;
}) {
  if (activeFilters.length === 0) return null;
  return (
    <div className="space-y-2 px-4">
      <span className="text-xs font-medium text-muted-foreground">فیلترهای فعال ({activeFilters.length}):</span>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter) => (
          <Badge key={filter.key} variant="default" className="gap-2 pe-1 ps-3">
            <span>{filter.label}</span>
            <button onClick={() => removeFilter(filter.key)} className="rounded-full hover:bg-primary/80">
              <XIcon className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

function AdvancedTabs<T extends BaseFilters>({
  tabs,
  localFilters,
  setLocalFilters,
  isMobile,
  hideSearch
}: {
  tabs: FilterTab[];
  localFilters: T;
  setLocalFilters: React.Dispatch<React.SetStateAction<T>>;
  isMobile: boolean;
  hideSearch: boolean;
}) {
  return (
    <div className="px-4">
      {!hideSearch && <h4 className="mb-3 text-sm font-medium text-muted-foreground">فیلترهای پیشرفته</h4>}
      <Tabs defaultValue={tabs[0]?.id} dir="rtl" className="w-full">
        <TabsList
          className={cn(
            "grid w-full",
            tabs.length === 1 && "grid-cols-1",
            tabs.length === 2 && "grid-cols-2",
            tabs.length === 3 && "grid-cols-3",
            tabs.length >= 4 && "grid-cols-4"
          )}
        >
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollArea className={cn(isMobile ? "h-56" : "h-64")}>
          <div className="pt-4">
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-0">
                {React.isValidElement(tab.content)
                  ? React.cloneElement(tab.content as React.ReactElement<{ filters?: T; onChange?: (f: T) => void }>, {
                      filters: localFilters,
                      onChange: setLocalFilters
                    })
                  : tab.content}
              </TabsContent>
            ))}
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

function FooterButtons({
  handleReset,
  handleApply,
  activeFiltersLength
}: {
  handleReset: () => void;
  handleApply: () => void;
  activeFiltersLength: number;
}) {
  return (
    <div className="border-border flex items-center justify-end gap-2 border-t px-4 pt-3">
      <Button variant="outline" size="sm" onClick={handleReset}>
        پاک کردن
      </Button>
      <Button size="sm" onClick={handleApply}>
        اعمال {activeFiltersLength > 0 && `(${activeFiltersLength})`}
      </Button>
    </div>
  );
}

function FilterDialogContent({
  isMobile,
  title,
  description,
  children
}: {
  isMobile: boolean;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  if (isMobile) {
    return (
      <>
        <DrawerHeader className="text-start">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {children}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">بستن</Button>
          </DrawerClose>
        </DrawerFooter>
      </>
    );
  }

  return (
    <>
      <DialogHeader className="text-start">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      {children}
    </>
  );
}

function useFilterHandlers<T extends BaseFilters>(
  filters: T,
  onFiltersChange: (filters: T) => void,
  onReset: () => void,
  setOpen: (open: boolean) => void
) {
  const [localFilters, setLocalFilters] = React.useState<T>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = React.useCallback(() => {
    onFiltersChange(localFilters);
    setOpen(false);
  }, [onFiltersChange, localFilters, setOpen]);

  const handleReset = React.useCallback(() => {
    onReset();
    setOpen(false);
  }, [onReset, setOpen]);

  const applyQuickFilter = React.useCallback(
    (quickFilter: QuickFilter<T>) => {
      setLocalFilters({ ...localFilters, ...quickFilter.filters });
    },
    [localFilters]
  );

  const removeFilter = React.useCallback(
    (key: string) => {
      const newFilters = { ...localFilters };
      if (key === "search") {
        newFilters.search = "";
      } else if (key in newFilters) {
        delete newFilters[key as keyof T];
      }
      setLocalFilters(newFilters);
    },
    [localFilters]
  );

  return { localFilters, setLocalFilters, handleApply, handleReset, applyQuickFilter, removeFilter };
}

function AdvancedFilterPanel<T extends BaseFilters>({
  isMobile,
  title,
  description,
  localFilters,
  setLocalFilters,
  searchFocused,
  setSearchFocused,
  searchPlaceholder,
  quickFilters,
  applyQuickFilter,
  hideSearch,
  activeFilters,
  removeFilter,
  tabs,
  handleReset,
  handleApply
}: {
  isMobile: boolean;
  title: string;
  description: string;
  localFilters: T;
  setLocalFilters: React.Dispatch<React.SetStateAction<T>>;
  searchFocused: boolean;
  setSearchFocused: React.Dispatch<React.SetStateAction<boolean>>;
  searchPlaceholder: string;
  quickFilters: QuickFilter<T>[];
  applyQuickFilter: (quickFilter: QuickFilter<T>) => void;
  hideSearch: boolean;
  activeFilters: ActiveFilter[];
  removeFilter: (key: string) => void;
  tabs: FilterTab[];
  handleReset: () => void;
  handleApply: () => void;
}) {
  return (
    <FilterDialogContent isMobile={isMobile} title={title} description={description}>
      <div className={cn("space-y-4", isMobile ? "pb-4" : "py-4")}>
        <SearchBar
          localFilters={localFilters}
          setLocalFilters={setLocalFilters}
          searchFocused={searchFocused}
          setSearchFocused={setSearchFocused}
          searchPlaceholder={searchPlaceholder}
          quickFilters={quickFilters}
          applyQuickFilter={applyQuickFilter}
          hideSearch={hideSearch}
        />
        {!hideSearch && <Separator />}
        <ActiveFiltersDisplay activeFilters={activeFilters} removeFilter={removeFilter} />
        <AdvancedTabs
          tabs={tabs}
          localFilters={localFilters}
          setLocalFilters={setLocalFilters}
          isMobile={isMobile}
          hideSearch={hideSearch}
        />
        <FooterButtons handleReset={handleReset} handleApply={handleApply} activeFiltersLength={activeFilters.length} />
      </div>
    </FilterDialogContent>
  );
}

export function AdvancedFilter<T extends BaseFilters>({
  triggerLabel = "جستجو و فیلتر",
  triggerIcon = <FilterIcon className="size-4" />,
  title = "جستجو و فیلتر پیشرفته",
  description = "جستجو کنید یا از فیلترها استفاده کنید",
  filters,
  onFiltersChange,
  onReset,
  quickFilters = [],
  tabs,
  getActiveFilters,
  searchPlaceholder = "جستجو...",
  hideSearch = false
}: AdvancedFilterProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);
  const isMobile = useIsMobile();

  const { localFilters, setLocalFilters, handleApply, handleReset, applyQuickFilter, removeFilter } = useFilterHandlers(
    filters,
    onFiltersChange,
    onReset,
    setOpen
  );

  const activeFilters = getActiveFilters?.(localFilters) ?? [];

  return (
    <>
      <Button variant="outline" size="default" onClick={() => setOpen(true)}>
        {triggerIcon}
        <span className="hidden md:inline">{triggerLabel}</span>
      </Button>
      <ResponsivePanel open={open} onOpenChange={setOpen}>
        <AdvancedFilterPanel
          isMobile={isMobile}
          title={title}
          description={description}
          localFilters={localFilters}
          setLocalFilters={setLocalFilters}
          searchFocused={searchFocused}
          setSearchFocused={setSearchFocused}
          searchPlaceholder={searchPlaceholder}
          quickFilters={quickFilters}
          applyQuickFilter={applyQuickFilter}
          hideSearch={hideSearch}
          activeFilters={activeFilters}
          removeFilter={removeFilter}
          tabs={tabs}
          handleReset={handleReset}
          handleApply={handleApply}
        />
      </ResponsivePanel>
    </>
  );
}
