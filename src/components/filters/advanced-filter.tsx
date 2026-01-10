"use client";

import * as React from "react";
import { SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

// ============================================
// Types
// ============================================

export interface BaseFilters {
  search?: string;
}

export interface QuickFilter<TFilters extends BaseFilters> {
  readonly label: string;
  readonly filters: Partial<TFilters>;
}

export interface FilterTab {
  readonly id: string;
  readonly label: string;
  readonly content: React.ReactNode;
}

export interface ActiveFilter {
  readonly key: string;
  readonly label: string;
}

type AdvancedFilterProps<TFilters extends BaseFilters> = {
  readonly filters: TFilters;
  readonly onFiltersChange: (filters: TFilters) => void;
  readonly onReset: () => void;
  readonly quickFilters?: readonly QuickFilter<TFilters>[];
  readonly tabs: readonly FilterTab[];
  readonly getActiveFilters: (filters: TFilters) => ActiveFilter[];
  readonly searchPlaceholder?: string;
  readonly title?: string;
  readonly description?: string;
  readonly triggerLabel?: string;
  readonly resultCount?: number;
};

// ============================================
// Filter Content (shared between mobile/desktop)
// ============================================

type FilterContentProps<TFilters extends BaseFilters> = {
  readonly filters: TFilters;
  readonly onFiltersChange: (filters: TFilters) => void;
  readonly quickFilters?: readonly QuickFilter<TFilters>[];
  readonly tabs: readonly FilterTab[];
  readonly searchPlaceholder?: string;
};

function FilterContent<TFilters extends BaseFilters>({
  filters,
  onFiltersChange,
  quickFilters,
  tabs,
  searchPlaceholder = "جستجو..."
}: FilterContentProps<TFilters>) {
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.id ?? "");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value || undefined });
  };

  const handleQuickFilter = (quickFilter: QuickFilter<TFilters>) => {
    onFiltersChange({ ...filters, ...quickFilter.filters });
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <SearchIcon className="text-muted-foreground pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2" />
        <input
          type="text"
          value={filters.search ?? ""}
          onChange={handleSearchChange}
          placeholder={searchPlaceholder}
          className="border-input bg-background placeholder:text-muted-foreground focus:ring-ring h-10 w-full rounded-lg border ps-9 pe-4 text-sm transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none"
        />
      </div>

      {/* Quick Filters */}
      {quickFilters && quickFilters.length > 0 && (
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-medium">فیلترهای سریع</p>
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((qf, index) => (
              <motion.button
                key={qf.label}
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickFilter(qf)}
                className="bg-secondary hover:bg-secondary/80 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
              >
                {qf.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex-1 sm:flex-none">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Clone the content and inject filters/onChange props */}
                {React.isValidElement(tab.content)
                  ? React.cloneElement(
                      tab.content as React.ReactElement<{ filters?: TFilters; onChange?: (f: TFilters) => void }>,
                      {
                        filters,
                        onChange: onFiltersChange
                      }
                    )
                  : tab.content}
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// ============================================
// Desktop Dialog
// ============================================

function DesktopFilter<TFilters extends BaseFilters>({
  filters,
  onFiltersChange,
  onReset,
  quickFilters,
  tabs,
  getActiveFilters,
  searchPlaceholder,
  title = "فیلترها",
  description,
  triggerLabel = "فیلترها",
  resultCount
}: AdvancedFilterProps<TFilters>) {
  const [open, setOpen] = React.useState(false);
  const [localFilters, setLocalFilters] = React.useState<TFilters>(filters);

  React.useEffect(() => {
    if (open) {
      setLocalFilters(filters);
    }
  }, [open, filters]);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    onReset();
    setOpen(false);
  };

  const activeFilters = getActiveFilters(filters);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontalIcon className="size-4" />
          {triggerLabel}
          {activeFilters.length > 0 && (
            <Badge variant="default" className="me-2 size-5 p-0">
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-border shrink-0 border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </div>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <XIcon className="size-4" />
                <span className="sr-only">بستن</span>
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-6">
            <FilterContent
              filters={localFilters}
              onFiltersChange={setLocalFilters}
              quickFilters={quickFilters}
              tabs={tabs}
              searchPlaceholder={searchPlaceholder}
            />
          </div>
        </ScrollArea>

        <DialogFooter className="border-border shrink-0 border-t px-6 py-4">
          <div className="flex w-full items-center justify-between gap-4">
            <Button variant="ghost" onClick={handleReset}>
              پاک کردن همه
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                انصراف
              </Button>
              <Button onClick={handleApply}>
                {resultCount !== undefined ? `نمایش ${resultCount.toLocaleString("fa-IR")} نتیجه` : "اعمال"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// Mobile Drawer
// ============================================

function MobileFilter<TFilters extends BaseFilters>({
  filters,
  onFiltersChange,
  onReset,
  quickFilters,
  tabs,
  getActiveFilters,
  searchPlaceholder,
  title = "فیلترها",
  description,
  triggerLabel = "فیلترها",
  resultCount
}: AdvancedFilterProps<TFilters>) {
  const [open, setOpen] = React.useState(false);
  const [localFilters, setLocalFilters] = React.useState<TFilters>(filters);

  React.useEffect(() => {
    if (open) {
      setLocalFilters(filters);
    }
  }, [open, filters]);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    onReset();
    setOpen(false);
  };

  const activeFilters = getActiveFilters(filters);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontalIcon className="size-4" />
          {triggerLabel}
          {activeFilters.length > 0 && (
            <Badge variant="default" className="me-2 size-5 p-0">
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="flex max-h-[96dvh] flex-col">
        <DrawerHeader className="border-border shrink-0 border-b text-start">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>

        <DrawerBody className="flex-1 overflow-auto p-4">
          <FilterContent
            filters={localFilters}
            onFiltersChange={setLocalFilters}
            quickFilters={quickFilters}
            tabs={tabs}
            searchPlaceholder={searchPlaceholder}
          />
        </DrawerBody>

        <DrawerFooter className="border-border shrink-0 border-t">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              پاک کردن همه
            </Button>
            <Button onClick={handleApply} className="flex-1">
              {resultCount !== undefined ? `نمایش ${resultCount.toLocaleString("fa-IR")} نتیجه` : "اعمال"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// ============================================
// Main Export (Auto-detects mobile/desktop)
// ============================================

export function AdvancedFilter<TFilters extends BaseFilters>(props: AdvancedFilterProps<TFilters>) {
  const isMobile = useIsMobile();

  return isMobile ? <MobileFilter {...props} /> : <DesktopFilter {...props} />;
}
