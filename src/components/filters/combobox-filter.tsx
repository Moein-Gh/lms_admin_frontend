"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon, SearchIcon } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type ComboboxFilterProps<T> = {
  readonly items: readonly T[];
  readonly selectedValue: string | undefined;
  readonly onSelect: (value: string | undefined) => void;
  readonly getItemId: (item: T) => string;
  readonly getItemLabel: (item: T) => string;
  readonly placeholder?: string;
  readonly searchPlaceholder?: string;
  readonly emptyMessage?: string;
  readonly allLabel?: string;
  readonly className?: string;
};

export function ComboboxFilter<T>({
  items,
  selectedValue,
  onSelect,
  getItemId,
  getItemLabel,
  placeholder = "انتخاب کنید...",
  searchPlaceholder = "جستجو...",
  emptyMessage = "موردی یافت نشد",
  allLabel = "همه",
  className
}: ComboboxFilterProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const selectedItem = items.find((item) => getItemId(item) === selectedValue);
  const displayValue = selectedItem ? getItemLabel(selectedItem) : placeholder;

  const filteredItems = React.useMemo(() => {
    if (!search.trim()) return items;
    const searchLower = search.toLowerCase();
    return items.filter((item) => getItemLabel(item).toLowerCase().includes(searchLower));
  }, [items, search, getItemLabel]);

  const handleSelect = (value: string) => {
    if (value === "__all__") {
      onSelect(undefined);
    } else {
      onSelect(value === selectedValue ? undefined : value);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", !selectedValue && "text-muted-foreground", className)}
        >
          {displayValue}
          <ChevronsUpDownIcon className="text-muted-foreground size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <div className="border-border flex items-center border-b px-3">
            <SearchIcon className="text-muted-foreground size-4 shrink-0" />
            <CommandInput
              placeholder={searchPlaceholder}
              value={search}
              onValueChange={setSearch}
              className="border-0 focus:ring-0"
            />
          </div>

          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>

            <ScrollArea className="max-h-60">
              <CommandGroup>
                {/* All option */}
                <CommandItem value="__all__" onSelect={() => handleSelect("__all__")}>
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-sm border",
                      !selectedValue
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {!selectedValue && <CheckIcon className="size-3" />}
                  </span>
                  <span className="flex-1">{allLabel}</span>
                </CommandItem>

                {/* Items */}
                {filteredItems.map((item, index) => {
                  const itemId = getItemId(item);
                  const isSelected = selectedValue === itemId;

                  return (
                    <motion.div
                      key={itemId}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <CommandItem value={itemId} onSelect={handleSelect}>
                        <span
                          className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded-sm border",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/30"
                          )}
                        >
                          {isSelected && <CheckIcon className="size-3" />}
                        </span>
                        <span className="flex-1 truncate">{getItemLabel(item)}</span>
                      </CommandItem>
                    </motion.div>
                  );
                })}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
