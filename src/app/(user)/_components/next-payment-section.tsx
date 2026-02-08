"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, Calendar } from "lucide-react";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/admin/use-current-user";
import { useUserPaymentSummary } from "@/hooks/admin/use-user";
import { cn } from "@/lib/utils";

export function NextPaymentSection() {
  const { data: user } = useAuth();
  const { data, isLoading } = useUserPaymentSummary(user?.id ?? "");

  if (isLoading) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-10" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const parseAmount = (v?: string) => {
    if (!v) return 0;
    const n = Number(String(v).replace(/[^0-9.-]+/g, ""));
    return isNaN(n) ? 0 : n;
  };

  const totalDue = parseAmount(data.totalDueAmount);
  if (totalDue === 0) return null;

  const overdue = parseAmount(data.overdueAmount);
  const upcoming = parseAmount(data.upcomingAmount);
  const hasOverdue = overdue > 0;

  return (
    <Card className="border-border/60 overflow-hidden py-4">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0 ">
            <div
              className={cn(
                "rounded-lg p-2.5 shrink-0",
                hasOverdue ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
              )}
            >
              {hasOverdue ? <AlertCircle className="size-5" /> : <Calendar className="size-5" />}
            </div>
            <h3 className="font-bold text-base">پرداخت‌ پیش رو</h3>
          </div>
          <div className="text-end shrink-0">
            <p className="text-[10px] text-muted-foreground mb-0.5">مجموع</p>
            <p className="font-bold text-lg tabular-nums">
              <FormattedNumber type="price" value={data.totalDueAmount} />
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0  space-y-3">
        {(hasOverdue || upcoming > 0) && (
          <div className="flex flex-col md:flex-row gap-2">
            {hasOverdue && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20 flex-1 min-w-0">
                <span className="text-xs text-muted-foreground">معوقه</span>
                <span className="font-bold text-sm text-destructive tabular-nums">
                  <FormattedNumber type="price" value={data.overdueAmount} />
                </span>
              </div>
            )}

            {upcoming > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20 flex-1 min-w-0">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-muted-foreground">پیش رو</span>
                  {data.upcomingDueDate && (
                    <span className="text-xs text-muted-foreground">
                      <FormattedDate value={data.upcomingDueDate} />
                    </span>
                  )}
                </div>
                <span className="font-bold text-sm text-primary tabular-nums">
                  <FormattedNumber type="price" value={data.upcomingAmount} />
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-2 flex md:justify-end">
          <Button variant="outline" size="sm" asChild className="w-full md:w-auto">
            <Link href="/payments" className="inline-flex items-center gap-2 px-3">
              مشاهده جزئیات کامل
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
