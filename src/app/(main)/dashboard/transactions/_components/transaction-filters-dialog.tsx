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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUsers } from "@/hooks/use-user";
import { TransactionKind, TransactionStatus } from "@/types/entities/transaction.type";

export interface TransactionFilters {
  search: string;
  transactionTypeId?: string;
  kind?: TransactionKind;
  userId?: string;
  status?: TransactionStatus;
}

interface TransactionFiltersDialogProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  onReset: () => void;
}

export function TransactionFiltersDialog({ filters, onFiltersChange, onReset }: TransactionFiltersDialogProps) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const handleApply = (newFilters: TransactionFilters) => {
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
            <DrawerDescription>وام‌ها را بر اساس معیارهای مختلف فیلتر کنید</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            <FilterForm filters={filters} onApply={handleApply} onReset={handleReset} />
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
        <DialogHeader className="text-right">
          <DialogTitle>فیلتر و جستجو</DialogTitle>
          <DialogDescription>وام‌ها را بر اساس معیارهای مختلف فیلتر کنید</DialogDescription>
        </DialogHeader>
        <FilterForm filters={filters} onApply={handleApply} onReset={handleReset} />
      </DialogContent>
    </Dialog>
  );
}

interface FilterFormProps {
  filters: TransactionFilters;
  onApply: (filters: TransactionFilters) => void;
  onReset: () => void;
}

function FilterForm({ filters, onApply, onReset }: FilterFormProps) {
  const [localFilters, setLocalFilters] = React.useState<TransactionFilters>(filters);

  const { data: usersData } = useUsers({ pageSize: 100 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(localFilters);
  };

  const handleReset = () => {
    setLocalFilters({
      search: "",
      transactionTypeId: undefined,
      userId: undefined,
      status: undefined
    });
    onReset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4 text-right">
      {/* Search Input */}
      <div className="space-y-2">
        <Label htmlFor="search">جستجو</Label>
        <div className="relative">
          <Input
            id="search"
            placeholder="نام تراکنش، کد، شماره کارت..."
            value={localFilters.search}
            onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
          />
          {localFilters.search && (
            <button
              type="button"
              onClick={() => setLocalFilters({ ...localFilters, search: "" })}
              className="absolute top-1/2 right-2 -translate-y-1/2"
              aria-label="پاک کردن جستجو"
            >
              <XIcon className="text-muted-foreground size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Kind Filter */}
      <div className="space-y-2">
        <Label htmlFor="kind">نوع تراکنش</Label>
        <Select
          value={localFilters.kind ?? "all"}
          onValueChange={(value) =>
            setLocalFilters({
              ...localFilters,
              kind: value === "all" ? undefined : (value as TransactionKind)
            })
          }
        >
          <SelectTrigger id="kind" className="text-right">
            <SelectValue placeholder="انتخاب نوع تراکنش" className="text-right" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه انواع</SelectItem>
            <SelectItem value="DEPOSIT">واریز</SelectItem>
            <SelectItem value="WITHDRAWAL">برداشت</SelectItem>
            <SelectItem value="LOAN_DISBURSEMENT">پرداخت وام</SelectItem>
            <SelectItem value="LOAN_REPAYMENT">بازپرداخت وام</SelectItem>
            <SelectItem value="SUBSCRIPTION_PAYMENT">پرداخت اشتراک</SelectItem>
            <SelectItem value="FEE">کارمزد</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User Filter */}
      <div className="space-y-2">
        <Label htmlFor="user">دارنده تراکنش</Label>
        <Select
          value={localFilters.userId ?? "all"}
          onValueChange={(value) =>
            setLocalFilters({
              ...localFilters,
              userId: value === "all" ? undefined : value
            })
          }
        >
          <SelectTrigger id="user" className="text-right">
            <SelectValue placeholder="انتخاب کاربر" className="text-right" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه کاربران</SelectItem>
            {usersData?.data.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.identity.name ?? user.identity.phone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <Label htmlFor="status">وضعیت</Label>
        <Select
          value={localFilters.status ?? "all"}
          onValueChange={(value) =>
            setLocalFilters({
              ...localFilters,
              status: value === "all" ? undefined : (value as TransactionStatus)
            })
          }
        >
          <SelectTrigger id="status" className="text-right">
            <SelectValue placeholder="انتخاب وضعیت" className="text-right" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه تراکنش‌ها</SelectItem>
            <SelectItem value={TransactionStatus.APPROVED}>تأیید شده</SelectItem>
            <SelectItem value={TransactionStatus.REJECTED}>رد شده</SelectItem>
            <SelectItem value={TransactionStatus.PENDING}>در انتظار بررسی</SelectItem>
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
