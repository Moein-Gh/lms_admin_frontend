"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CreateLoanRequestButton } from "../accounts/_components/create-loan-request-button";
import { CreateDepositDialog } from "./create-deposit-dialog";

export function DashboardQuickActions() {
  return (
    <Card className="overflow-hidden border border-border/60 py-4 shadow-sm">
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-base font-bold tracking-tight md:text-lg">اقدام سریع</h2>
          <p className="text-xs text-muted-foreground md:text-sm">دو میانبر اصلی برای درخواست وام و ثبت واریز.</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <CreateLoanRequestButton
            buttonSize="sm"
            buttonClassName="h-10 w-full rounded-xl border border-blue-500/15 bg-blue-500/6 px-3 text-xs text-foreground shadow-none hover:bg-blue-500/10 sm:text-sm"
            hideLabelOnMobile={false}
          />

          <CreateDepositDialog
            buttonSize="sm"
            buttonClassName="h-10 w-full rounded-xl border border-emerald-500/15 bg-emerald-500/6 px-3 text-xs text-foreground shadow-none hover:bg-emerald-500/10 sm:text-sm"
            buttonLabel="ثبت واریز"
          />
        </div>
      </CardContent>
    </Card>
  );
}
