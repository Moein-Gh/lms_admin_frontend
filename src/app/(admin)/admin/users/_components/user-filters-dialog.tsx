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
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pills } from "@/components/ui/pills";
import { useDataTableParams } from "@/hooks/general/use-data-table-params";
import { useIsMobile } from "@/hooks/general/use-mobile";
import { UserStatus } from "@/types/entities/user.type";

export function UserFiltersDialog() {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm" aria-label="فیلتر و جستجو">
            <FilterIcon className="size-4" />
            <span className="hidden sm:inline">فیلتر و جستجو</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-start">
            <DrawerTitle>فیلتر و جستجو</DrawerTitle>
            <DrawerDescription>کاربران را بر اساس معیارهای مختلف فیلتر کنید</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            <FilterForm onOpenChange={setOpen} />
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
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>فیلتر و جستجو</DialogTitle>
          <DialogDescription>کاربران را بر اساس معیارهای مختلف فیلتر کنید</DialogDescription>
        </DialogHeader>
        <FilterForm onOpenChange={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

function FilterForm({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const { searchParams, setParams, reset } = useDataTableParams();

  // Local state for form inputs before applying
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const [status, setStatus] = React.useState<string | undefined>(searchParams.get("status") ?? "all");

  // Sync local state with URL when URL changes (e.g. clear filters)
  React.useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
    setStatus(searchParams.get("status") ?? "all");
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setParams({
      search: search || null,
      status: status && status !== "all" ? status : null
    });

    onOpenChange(false);
  };

  const handleReset = () => {
    reset();
    setSearch("");
    setStatus("all");
    onOpenChange(false);
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="absolute top-1/2 left-2 -translate-y-1/2">
              <XIcon className="text-muted-foreground size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <Label htmlFor="status">وضعیت</Label>
        <Pills
          options={[
            { value: "all", label: "همه کاربران" },
            { value: UserStatus.ACTIVE, label: "فعال" },
            { value: UserStatus.INACTIVE, label: "غیرفعال" }
          ]}
          size="sm"
          variant="outline"
          value={status ?? "all"}
          onValueChange={(value) => setStatus(value)}
        />
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
