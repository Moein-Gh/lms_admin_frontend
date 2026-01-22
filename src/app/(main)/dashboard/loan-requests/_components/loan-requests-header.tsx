"use client";

import * as React from "react";
import { FileText } from "lucide-react";
import { CreateLoanRequestDialog } from "./create-loan-request-dialog";

type LoanRequestsHeaderProps = {
  filterTrigger?: React.ReactNode;
};

export function LoanRequestsHeader({ filterTrigger }: LoanRequestsHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold">درخواست‌های وام</h1>
          <p className="text-sm text-muted-foreground">مدیریت درخواست‌های وام کاربران</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {filterTrigger}
        <CreateLoanRequestDialog />
      </div>
    </div>
  );
}
