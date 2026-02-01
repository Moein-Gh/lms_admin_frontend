"use client";

import * as React from "react";
import { FileText, ChevronLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { CreateLoanRequestDialog } from "./create-loan-request-dialog";

type LoanRequestsHeaderProps = {
  filterTrigger?: React.ReactNode;
};

export function LoanRequestsHeader({ filterTrigger }: LoanRequestsHeaderProps) {
  return (
    <div
      data-slot="loan-requests-header"
      className={cn("flex items-center justify-between gap-4", "border-b border-border/40 pb-6")}
    >
      <div className="flex flex-col gap-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">داشبورد</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronLeft />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>درخواست‌های وام</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl sm:h-12 sm:w-12">
            <FileText className="size-5 sm:size-6" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-md font-bold tracking-tight sm:text-3xl">درخواست‌های وام</h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">مدیریت درخواست‌های وام کاربران</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {filterTrigger}
        <CreateLoanRequestDialog />
      </div>
    </div>
  );
}
