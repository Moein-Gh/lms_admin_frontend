"use client";

import { ChevronLeft, HandCoins } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { CreateLoanDialog } from "./create-loan-dialog";
import { LoanFilters, LoanFiltersDialog } from "./loan-filters-dialog";

type Props = {
  filters: LoanFilters;
  onFiltersChange: (f: LoanFilters) => void;
  onReset: () => void;
  total?: number;
};

export function LoansHeader({ filters, onFiltersChange, onReset, total }: Props) {
  return (
    <div
      data-slot="loans-header"
      className={cn("flex items-center justify-between gap-4", "border-b border-border/40 pb-6")}
    >
      <div className="flex flex-col gap-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">داشبورد</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronLeft />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>وام‌ها</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl sm:h-12 sm:w-12">
            <HandCoins className="size-6 sm:size-7" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight sm:text-3xl">وام‌ها</h1>
            {total !== undefined && (
              <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
                {total.toLocaleString("fa-IR")} وام
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <LoanFiltersDialog filters={filters} onFiltersChange={onFiltersChange} onReset={onReset} />
        <CreateLoanDialog />
      </div>
    </div>
  );
}
