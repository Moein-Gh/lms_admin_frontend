"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser, useUserUpcomingPayments } from "@/hooks/admin/use-user";

import { EmptyPaymentsState } from "./_components/empty-payments-state";
import { MonthlyPaymentSection } from "./_components/monthly-payment-section";
import { PaymentHeader } from "./_components/payment-header";
import { PaymentSummary } from "./_components/payment-summary";

export default function UserUpcomingPaymentsPage() {
  const { userId } = useParams();
  const [includePastPaid, setIncludePastPaid] = useState(false);

  const { data: user } = useUser(userId as string);
  const { data, isLoading, error } = useUserUpcomingPayments(userId as string, { includePastPaid });

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto py-3 sm:py-6 px-3 sm:px-4 space-y-4 sm:space-y-6">
        <Skeleton className="h-10 sm:h-12 w-full max-w-xs" />
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Skeleton className="h-20 flex-1" />
          <Skeleton className="h-20 flex-1" />
          <Skeleton className="h-20 flex-1" />
        </div>
        <Skeleton className="h-64 sm:h-80" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-5xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
        <div className="text-center text-destructive">خطا در بارگذاری اطلاعات پرداخت‌ها</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const hasUpcoming = data.upcomingMonths.length > 0;
  const hasPast = data.pastMonths.length > 0;
  const userName = user?.identity.name ?? undefined;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="container max-w-5xl mx-auto py-3 sm:py-6 px-3 sm:px-4 space-y-4 sm:space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top section */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/60">
          <CardContent className="px-4 sm:px-6 py-4 sm:py-6 space-y-4">
            <PaymentHeader userName={userName} />
            <PaymentSummary grandTotal={data.grandTotal} totalPaid={data.totalPaid} totalUnpaid={data.totalUnpaid} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Upcoming Payments */}
      {hasUpcoming && (
        <motion.div className="space-y-3 sm:space-y-4" variants={itemVariants}>
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary" />
            <h2 className="font-bold text-sm sm:text-base">ماه‌های آینده</h2>
          </div>
          <div className="space-y-2.5 sm:space-y-3">
            {data.upcomingMonths.map((month) => (
              <MonthlyPaymentSection key={month.month} month={month} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Past Payments */}
      {hasPast && (
        <motion.div className="space-y-3 sm:space-y-4" variants={itemVariants}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-muted-foreground" />
              <h2 className="font-bold text-sm sm:text-base">ماه‌های گذشته</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIncludePastPaid(!includePastPaid)}
              className="text-[10px] sm:text-xs h-8 px-2 sm:px-3"
            >
              {includePastPaid ? "مخفی کردن پرداختی‌ها" : "نمایش پرداختی‌ها"}
            </Button>
          </div>
          <div className="space-y-2.5 sm:space-y-3">
            {data.pastMonths.map((month) => (
              <MonthlyPaymentSection key={month.month} month={month} />
            ))}
          </div>
        </motion.div>
      )}

      {!hasUpcoming && !hasPast && (
        <motion.div variants={itemVariants}>
          <EmptyPaymentsState />
        </motion.div>
      )}
    </motion.div>
  );
}
