"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-current-user";
import { useUserPaymentSummary } from "@/hooks/use-user";
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

  if (!data || data.totalDueCount === 0) {
    return null;
  }

  const hasOverdue = data.overdueCount > 0;

  return (
    <Card className="border-border/60 overflow-hidden py-4">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className={cn(
                "rounded-lg p-2.5 shrink-0",
                hasOverdue ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
              )}
            >
              {hasOverdue ? <AlertCircle className="size-5" /> : <Calendar className="size-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-base">پرداخت‌ پیش رو</h3>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>
                  <FormattedNumber type="normal" value={data.totalDueCount} /> مورد
                </span>
                {hasOverdue && (
                  <>
                    <span>•</span>
                    <span className="text-destructive font-medium">
                      <FormattedNumber type="normal" value={data.overdueCount} /> معوقه
                    </span>
                  </>
                )}
              </div>
              {hasOverdue && (
                <Badge variant="destructive" className="mt-2 text-[10px] px-2 py-0.5">
                  شامل پرداخت‌های معوقه
                </Badge>
              )}
            </div>
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
        {hasOverdue && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <span className="text-xs text-muted-foreground">معوقه</span>
            <span className="font-bold text-sm text-destructive tabular-nums">
              <FormattedNumber type="price" value={data.overdueAmount} />
            </span>
          </div>
        )}

        {data.upcomingCount > 0 && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
            <span className="text-xs text-muted-foreground">پیش رو</span>
            <span className="font-bold text-sm text-primary tabular-nums">
              <FormattedNumber type="price" value={data.upcomingAmount} />
            </span>
          </div>
        )}

        <Button variant="outline" size="sm" asChild className="w-full">
          <Link href="/payments" className="gap-2">
            مشاهده جزئیات کامل
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
