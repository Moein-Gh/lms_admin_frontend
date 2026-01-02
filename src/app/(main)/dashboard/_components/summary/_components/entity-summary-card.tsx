import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { FormattedNumber } from "@/components/formatted-number";
import { cn } from "@/lib/utils";

type EntitySummaryCardProps = {
  readonly title: string;
  readonly totalValue: number;
  readonly icon: ReactNode;
  readonly href: string;
  readonly pendingCount?: number;
  readonly stats?: ReadonlyArray<{
    readonly label: string;
    readonly value: number;
    readonly variant?: "default" | "success" | "warning";
  }>;
  readonly className?: string;
};

const variantStyles = {
  default: "text-foreground",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400"
};

export function EntitySummaryCard({
  title,
  totalValue,
  icon,
  href,
  stats,
  pendingCount,
  className
}: EntitySummaryCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-lg bg-card p-2.5 transition-colors hover:bg-accent/50",
        className
      )}
    >
      {/* Icon (with optional pending indicator) */}
      <div className="relative">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary [&_svg]:size-4">
          {icon}
        </div>
        {typeof pendingCount === "number" && pendingCount > 0 && (
          <span className="absolute -top-0.5 -end-0.5 flex">
            <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-amber-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500 ring-2 ring-card" />
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">{title}</p>
          <p className="text-base font-bold tabular-nums">
            <FormattedNumber type="normal" value={totalValue} />
          </p>
        </div>

        {/* Stats pills */}
        {stats && stats.length > 0 && (
          <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[10px]"
              >
                <span className="text-muted-foreground">{stat.label}:</span>
                <span className={cn("font-semibold tabular-nums", variantStyles[stat.variant ?? "default"])}>
                  <FormattedNumber type="normal" value={stat.value} />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Arrow */}
      <ChevronLeft className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
    </Link>
  );
}
