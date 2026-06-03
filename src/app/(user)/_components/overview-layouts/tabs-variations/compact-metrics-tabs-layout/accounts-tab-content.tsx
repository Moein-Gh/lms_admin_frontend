"use client";

import { FormattedNumber } from "@/components/formatted-number";
import { AccountIcon } from "@/components/icons";

import { Separator } from "@/components/ui/separator";
import type { CompactMetricsTabContentProps } from "./types";

export function AccountsTabContent({ overview }: CompactMetricsTabContentProps) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-green-500/30 to-green-500/10 text-green-600 shadow-md ring-1 ring-green-500/20 dark:text-green-400">
          <AccountIcon className="size-7" />
        </div>

        <div className="flex flex-1 items-center gap-3 md:gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">موجودی کل حساب‌ها</p>
            <p className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              <FormattedNumber type="price" value={overview.totalAccountBalance} />
            </p>
          </div>

          <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-12 bg-border" />
          <div className="flex w-[30%] shrink-0 flex-col items-center gap-1 rounded-xl bg-card/40 px-3 py-2 text-center md:w-[10%] md:px-4 md:py-2.5">
            <span className="text-lg md:text-xl font-bold text-primary">
              <FormattedNumber type="normal" value={overview.activeAccountsCount} />
            </span>
            <span className="text-xs text-muted-foreground">حساب فعال</span>
          </div>
        </div>
      </div>
    </div>
  );
}
