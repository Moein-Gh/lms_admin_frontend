"use client";

import { LayoutGroup, motion } from "motion/react";
import { DashboardHeader } from "./_components/dashboard-header";
import { DashboardQuickActions } from "./_components/dashboard-quick-actions";
import { NextPaymentSection } from "./_components/next-payment-section";
import { CompactMetricsTabsLayout } from "./_components/overview-layouts/tabs-variations/compact-metrics-tabs-layout";

export default function UserDashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <LayoutGroup>
        <div className="space-y-3">
          {/* Header */}
          <DashboardHeader />

          {/* Main Content */}
          <motion.div layout="position" transition={{ layout: { duration: 0.28, ease: "easeInOut" } }}>
            <CompactMetricsTabsLayout />
          </motion.div>

          {/* Next Payment Section */}
          <motion.div layout transition={{ layout: { duration: 0.28, ease: "easeInOut" } }}>
            <NextPaymentSection />
          </motion.div>

          <motion.div layout transition={{ layout: { duration: 0.28, ease: "easeInOut" } }}>
            <DashboardQuickActions />
          </motion.div>
        </div>
      </LayoutGroup>
    </div>
  );
}
