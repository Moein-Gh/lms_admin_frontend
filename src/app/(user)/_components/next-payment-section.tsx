"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { FormattedNumber } from "@/components/formatted-number";
import { ArrowLeft, CalendarClock, ChevronDown } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserPaymentSummary } from "@/hooks/user/use-dashboard";
import { formatPersianDate } from "@/lib/date-service";
import { cn } from "@/lib/utils";
import type { PaymentSummaryDto } from "@/types/entities/payment.type";

const SHOW_TEMP_PREVIEW = process.env.NODE_ENV !== "production";

type PaymentScenario = PaymentSummaryDto & {
  name: string;
};

const TEMP_PAYMENT_SCENARIOS = [
  {
    name: "حالت معوقه + قسط پیش رو",
    totalDueAmount: "78,500,000",
    overdueAmount: "24,000,000",
    upcomingAmount: "54,500,000",
    upcomingDueDate: new Date("2026-03-18")
  },
  {
    name: "فقط پرداخت زمان‌بندی‌شده",
    totalDueAmount: "31,200,000",
    overdueAmount: "0",
    upcomingAmount: "31,200,000",
    upcomingDueDate: new Date("2026-03-25")
  },
  {
    name: "تسویه‌شده",
    totalDueAmount: "0",
    overdueAmount: "0",
    upcomingAmount: "0",
    upcomingDueDate: null
  }
] as const satisfies readonly PaymentScenario[];

function parseAmount(value?: string) {
  if (!value) return 0;

  const parsedValue = Number(String(value).replace(/[^0-9.-]+/g, ""));
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
}

export function NextPaymentSection() {
  const { data, isLoading } = useUserPaymentSummary();
  const [previewName, setPreviewName] = useState<PaymentScenario["name"]>(TEMP_PAYMENT_SCENARIOS[0].name);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  if (isLoading) {
    return (
      <Card className="border-border/60">
        <div className="space-y-3 p-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-10" />
        </div>
      </Card>
    );
  }

  if (!data && !SHOW_TEMP_PREVIEW) return null;

  const previewSummary =
    TEMP_PAYMENT_SCENARIOS.find((scenario) => scenario.name === previewName) ?? TEMP_PAYMENT_SCENARIOS[0];
  const summary = data ?? previewSummary;

  const overdueAmount = parseAmount(summary.overdueAmount);
  const upcomingAmount = parseAmount(summary.upcomingAmount);
  const dueDateDay = summary.upcomingDueDate ? formatPersianDate(summary.upcomingDueDate, "dd") : "—";
  const dueDateMonth = summary.upcomingDueDate ? formatPersianDate(summary.upcomingDueDate, "MMMM") : "بدون سررسید";
  const dueDateYear = summary.upcomingDueDate ? formatPersianDate(summary.upcomingDueDate, "yyyy") : "";

  return (
    <div className="space-y-4">
      {SHOW_TEMP_PREVIEW && !data && (
        <div className="flex flex-wrap gap-2">
          {TEMP_PAYMENT_SCENARIOS.map((scenario) => (
            <Button
              key={scenario.name}
              type="button"
              size="sm"
              variant={previewName === scenario.name ? "secondary" : "outline"}
              className="rounded-full"
              onClick={() => {
                setPreviewName(scenario.name);
              }}
            >
              {scenario.name}
            </Button>
          ))}
        </div>
      )}

      <Card className="overflow-hidden border border-border/60 shadow-sm">
        <div className="space-y-3 p-4">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500/30 to-blue-500/10 text-blue-600 shadow-md ring-1 ring-blue-500/20 dark:text-blue-500">
              <CalendarClock className="size-7" />
            </div>

            <div className="flex flex-1 items-center gap-3 md:gap-4">
              <div className="flex-1">
                <p className="text-base font-medium text-muted-foreground">پرداخت پیش رو</p>
                <p className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
                  <FormattedNumber type="price" value={summary.totalDueAmount} />
                </p>
              </div>

              <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-12 bg-border" />
              <div className="flex w-[30%] shrink-0 flex-col items-center gap-1 rounded-xl bg-card/40 px-3 py-2 text-center md:w-[10%] md:px-4 md:py-2.5">
                <span className="text-lg font-bold text-primary md:text-xl">{dueDateDay}</span>
                <span className="text-xs text-muted-foreground">{dueDateMonth}</span>
              </div>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {isDetailsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.24, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="space-y-3 border-t border-border/70 pt-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">بدهی ماه‌های قبل</span>
                    <span className={cn("font-semibold", overdueAmount > 0 && "text-destructive")}>
                      {overdueAmount > 0 ? <FormattedNumber type="price" value={summary.overdueAmount} /> : "ندارد"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">پرداخت پیش رو</span>
                    <span className={cn("font-semibold", upcomingAmount > 0 && "text-primary")}>
                      {upcomingAmount > 0 ? (
                        <FormattedNumber type="price" value={summary.upcomingAmount} />
                      ) : (
                        "ثبت نشده"
                      )}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between border-t border-border/70 pt-3">
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm font-medium"
              onClick={() => setIsDetailsOpen((prev) => !prev)}
            >
              <motion.span
                animate={{ rotate: isDetailsOpen ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="inline-flex"
              >
                <ChevronDown className="size-4 text-muted-foreground" />
              </motion.span>
              <span>مشاهده جزئیات</span>
            </button>
            <AnimatePresence initial={false}>
              {isDetailsOpen && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <Button variant="secondary" size="sm" asChild>
                    <Link href="/payments" className="inline-flex items-center gap-2">
                      مشاهده جزئیات کامل
                      <ArrowLeft className="size-4" />
                    </Link>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </div>
  );
}
