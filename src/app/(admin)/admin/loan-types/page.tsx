"use client";

import { LoanTypeCardList } from "./_components/loan-type-card-list";
import { LoanTypeDesktopList } from "./_components/loan-type-desktop-list";
import { LoanTypesHeader } from "./_components/loan-types-header";

export default function LoanTypesPage() {
  return (
    <div className="space-y-6">
      <LoanTypesHeader />

      {/* Desktop View */}
      <div className="hidden sm:block">
        <LoanTypeDesktopList />
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <LoanTypeCardList />
      </div>
    </div>
  );
}
