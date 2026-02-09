"use client";

import { HandCoins } from "lucide-react";
import { PageHeader } from "../_components/page-header";
import { ActiveLoansList } from "./_components/active-loans-list";

export default function UserLoansPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="space-y-6">
        <PageHeader icon={HandCoins} title="وام‌های من" />

        {/* Summary/Chart Section - Placeholder */}
        {/* <LoansSummary /> */}

        {/* Active Loans */}
        <ActiveLoansList />
      </div>
    </div>
  );
}
