"use client";

import { motion } from "motion/react";
import { AccountIcon, LoanIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { TabType } from "./types";

type CompactMetricsTabsControlProps = {
  readonly activeTab: TabType;
  readonly onTabChange: (tab: TabType) => void;
};

const tabs = [
  { value: "accounts" as const, label: "حساب‌ها", Icon: AccountIcon },
  { value: "loans" as const, label: "وام‌ها", Icon: LoanIcon }
];

export function CompactMetricsTabsControl({ activeTab, onTabChange }: CompactMetricsTabsControlProps) {
  return (
    <div className="flex md:w-36 md:flex-col md:gap-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <Button
            key={tab.value}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onTabChange(tab.value)}
            className={cn(
              "relative h-auto flex-1 rounded-xl px-3 py-2 text-sm font-medium md:flex-none hover:bg-transparent hover:text-foreground/80 hover:cursor-pointer",
              isActive && "text-foreground"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="compact-metrics-tabs-active-pill"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-xl bg-background"
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              <tab.Icon className="size-4" />
              {tab.label}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
