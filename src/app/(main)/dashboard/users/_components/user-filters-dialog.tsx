"use client";

import * as React from "react";

import { FilterIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

export interface UserFilters {
  search: string;
  isActive?: boolean;
}

interface UserFiltersDialogProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  onReset: () => void;
}

export function UserFiltersDialog({
  filters,
  onFiltersChange,
  onReset,
}: UserFiltersDialogProps) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const handleApply = (newFilters: UserFilters) => {
    onFiltersChange(newFilters);
    setOpen(false);
  };

  const handleReset = () => {
    onReset();
    setOpen(false);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <FilterIcon className="size-4" />
            فیلتر و جستجو
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-right">
            <DrawerTitle>فیلتر و جستجو</DrawerTitle>
            <DrawerDescription>
              کاربران را بر اساس معیارهای مختلف فیلتر کنید
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            <FilterForm
              filters={filters}
              onApply={handleApply}
              onReset={handleReset}
            />
          </div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">انصراف</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FilterIcon className="size-4" />
          فیلتر و جستجو
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>فیلتر و جستجو</DialogTitle>
          <DialogDescription>
            کاربران را بر اساس معیارهای مختلف فیلتر کنید
          </DialogDescription>
        </DialogHeader>
        <FilterForm
          filters={filters}
          onApply={handleApply}
          onReset={handleReset}
        />
      </DialogContent>
    </Dialog>
  );
}

interface FilterFormProps {
  filters: UserFilters;
  onApply: (filters: UserFilters) => void;
  onReset: () => void;
}

function FilterForm({ filters, onApply, onReset }: FilterFormProps) {
  const [localFilters, setLocalFilters] = React.useState<UserFilters>(filters);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(localFilters);
  };

  const handleReset = () => {
    setLocalFilters({ search: "", isActive: undefined });
    onReset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      {/* Search Input */}
      <div className="space-y-2">
        <Label htmlFor="search">جستجو</Label>
        <div className="relative">
          <Input
            id="search"
            placeholder="نام، شماره تلفن یا ایمیل..."
            value={localFilters.search}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, search: e.target.value })
            }
          />
          {localFilters.search && (
            <button
              type="button"
              onClick={() => setLocalFilters({ ...localFilters, search: "" })}
              className="absolute top-1/2 left-2 -translate-y-1/2"
            >
              <XIcon className="text-muted-foreground size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <Label htmlFor="status">وضعیت</Label>
        <Select
          value={
            localFilters.isActive === undefined
              ? "all"
              : localFilters.isActive
                ? "active"
                : "inactive"
          }
          onValueChange={(value) =>
            setLocalFilters({
              ...localFilters,
              isActive:
                value === "all" ? undefined : value === "active" ? true : false,
            })
          }
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="انتخاب وضعیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه کاربران</SelectItem>
            <SelectItem value="active">فعال</SelectItem>
            <SelectItem value="inactive">غیرفعال</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          اعمال فیلترها
        </Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          پاک کردن
        </Button>
      </div>
    </form>
  );
}
