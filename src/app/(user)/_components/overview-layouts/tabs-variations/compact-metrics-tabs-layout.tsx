"use client";

import { motion } from "motion/react";
import { useUserOverview } from "@/hooks/user/use-dashboard";
import { AccountsTabContent } from "./compact-metrics-tabs-layout/accounts-tab-content";
import { LoansTabContent } from "./compact-metrics-tabs-layout/loans-tab-content";

export function CompactMetricsTabsLayout() {
  const { data: overview, isLoading } = useUserOverview();

  if (isLoading || !overview) {
    return <div className="h-40 animate-pulse rounded-xl bg-muted" />;
  }

  const loanProgressPercentage = Math.min(100, Math.max(0, overview.loanPaymentPercentage));

  return (
    <div className="space-y-3">
      <motion.div
        layout
        transition={{ layout: { duration: 0.28, ease: "easeInOut" } }}
        className="overflow-hidden rounded-xl bg-card"
      >
        <AccountsTabContent overview={overview} />
      </motion.div>

      <motion.div
        layout
        transition={{ layout: { duration: 0.28, ease: "easeInOut" } }}
        className="overflow-hidden rounded-xl bg-card"
      >
        <LoansTabContent overview={overview} loanProgressPercentage={loanProgressPercentage} />
      </motion.div>
    </div>
  );
}
