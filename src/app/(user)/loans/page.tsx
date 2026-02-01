"use client";

import { HandCoins } from "lucide-react";
import { ActiveLoansList } from "./_components/active-loans-list";

export default function UserLoansPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="space-y-6">
        <div className="flex flex-row items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl sm:h-12 sm:w-12">
            <HandCoins className="size-6 sm:size-7" />
          </div>
          <h1 className="text-2xl font-bold md:text-3xl">وام‌های من</h1>
        </div>

        {/* Summary/Chart Section - Placeholder */}
        {/* <LoansSummary /> */}

        {/* Active Loans */}
        <ActiveLoansList />
      </div>
    </div>
  );
}
