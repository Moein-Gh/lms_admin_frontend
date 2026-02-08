"use client";

import { TrendingUp, Wallet, CalendarClock } from "lucide-react";
import { FormattedNumber } from "@/components/formatted-number";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/admin/use-current-user";
import { useLoans } from "@/hooks/admin/use-loan";
import { LoanStatus } from "@/types/entities/loan.type";

export function LoansSummary() {
  const { data: user } = useAuth();

  const { data: loansData } = useLoans({
    page: 1,
    pageSize: 100,
    status: LoanStatus.ACTIVE,
    userId: user?.id
  });

  const activeLoans = loansData?.data ?? [];
  const totalDebt = activeLoans.reduce((sum, loan) => {
    const remaining = loan.balanceSummary?.outstandingBalance ?? loan.amount;
    return sum + Number(remaining);
  }, 0);

  // Find the nearest installment due date
  const nextInstallment = activeLoans.reduce((nearest) => {
    // This is a simplified version - you might want to fetch actual installments
    return nearest;
  }, 0);

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4  transition-shadow">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
              <Wallet className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-medium text-muted-foreground">وام‌های فعال</h3>
              <p className="text-2xl font-bold mt-1">
                <FormattedNumber type="normal" value={activeLoans.length} />
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4  transition-shadow">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950">
              <TrendingUp className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-medium text-muted-foreground">کل بدهی باقیمانده</h3>
              <p className="text-2xl font-bold mt-1">
                <FormattedNumber type="price" value={totalDebt} />
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4  transition-shadow">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950">
              <CalendarClock className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-medium text-muted-foreground">میانگین قسط</h3>
              <p className="text-2xl font-bold mt-1">
                <FormattedNumber type="price" value={nextInstallment} />
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
