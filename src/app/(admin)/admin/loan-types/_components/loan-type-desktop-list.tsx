"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useLoanTypes } from "@/hooks/admin/use-loan-type";
import { LoanTypeDesktopCard } from "./loan-type-desktop-card";

export function LoanTypeDesktopList() {
  const { data, isLoading, error } = useLoanTypes();

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center text-destructive">
        خطا در بارگذاری اطلاعات
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
        هیچ نوع وامی تعریف نشده است.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.data.map((loanType) => (
        <LoanTypeDesktopCard key={loanType.id} loanType={loanType} />
      ))}
    </div>
  );
}
