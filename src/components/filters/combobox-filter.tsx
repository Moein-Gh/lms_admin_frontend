"use client";

import * as React from "react";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ComboboxFilterProps<T> {
  items: T[];
  selectedValue?: string;
  onSelect: (value?: string) => void;
  getItemId: (item: T) => string;
  getItemLabel: (item: T) => string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  allLabel?: string;
}

export function ComboboxFilter<T>({
  items,
  selectedValue,
  onSelect,
  getItemId,
  getItemLabel,
  placeholder = "انتخاب کنید...",
  searchPlaceholder = "جستجو...",
  emptyMessage = "موردی یافت نشد",
  allLabel = "همه"
}: ComboboxFilterProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const selectedItem = items.find((item) => getItemId(item) === selectedValue);

  const filteredItems = React.useMemo(() => {
    if (!searchQuery) return items;
    return items.filter((item) => getItemLabel(item).toLowerCase().includes(searchQuery.toLowerCase()));
  }, [items, searchQuery, getItemLabel]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedItem ? getItemLabel(selectedItem) : placeholder}
          <ChevronsUpDownIcon className="me-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}>
          <CommandInput placeholder={searchPlaceholder} value={searchQuery} onValueChange={setSearchQuery} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {allLabel && (
                <CommandItem
                  value="clear"
                  onSelect={() => {
                    onSelect(undefined);
                    setOpen(false);
                  }}
                >
                  <CheckIcon className={cn("me-2 size-4", !selectedValue ? "opacity-100" : "opacity-0")} />
                  {allLabel}
                </CommandItem>
              )}
              {filteredItems.map((item) => {
                const id = getItemId(item);
                return (
                  <CommandItem
                    key={id}
                    value={id}
                    onSelect={() => {
                      onSelect(id);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon className={cn("me-2 size-4", selectedValue === id ? "opacity-100" : "opacity-0")} />
                    {getItemLabel(item)}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
