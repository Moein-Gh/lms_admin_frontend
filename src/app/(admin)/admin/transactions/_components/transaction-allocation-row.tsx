"use client";

import Link from "next/link";
import { FormattedNumber } from "@/components/formatted-number";
import { ArrowLeft } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { JournalEntryTarget } from "@/types/entities/journal-entry.type";

// ── Type config ───────────────────────────────────────────────

export const TYPE_CONFIG = {
  [JournalEntryTarget.INSTALLMENT]: {
    label: "قسط",
    badgeCls: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400"
  },
  [JournalEntryTarget.LOAN]: {
    label: "وام",
    badgeCls: "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400"
  },
  [JournalEntryTarget.SUBSCRIPTION_FEE]: {
    label: "ماهیانه",
    badgeCls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
  },
  [JournalEntryTarget.ACCOUNT]: {
    label: "حساب",
    badgeCls: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
  }
} as const;

// ── Shared types ──────────────────────────────────────────────

export type DetailField = {
  readonly id: string;
  readonly icon: React.ReactNode;
  readonly value: React.ReactNode;
};

export type AllocationItem = {
  readonly entryId: string;
  readonly targetType: JournalEntryTarget;
  readonly title: string;
  readonly details: DetailField[];
  readonly amount: string;
  readonly href: string | null;
};

// ── Row component ─────────────────────────────────────────────

export function AllocationRow({ item }: { readonly item: AllocationItem }) {
  const config = TYPE_CONFIG[item.targetType];

  const inner = (
    <div className="group flex flex-col gap-2.5 rounded-lg border bg-card px-4 py-3.5 transition-colors hover:bg-accent/30">
      {/* Top row: type badge + amount + button */}
      <div className="flex items-center gap-2">
        <Badge className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold", config.badgeCls)}>
          {config.label}
        </Badge>

        <span className="ms-auto text-base font-bold tabular-nums text-foreground">
          <FormattedNumber type="price" value={item.amount} />
        </span>

        {item.href && (
          <div className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-accent group-hover:text-primary">
            <ArrowLeft className="size-4" />
          </div>
        )}
      </div>

      {/* Middle: title */}
      <p className="text-sm font-semibold leading-snug text-foreground">{item.title}</p>

      {/* Bottom: detail fields */}
      {item.details.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
          {item.details.map((d) => (
            <span key={d.id} className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="text-muted-foreground/60">{d.icon}</span>
              <span>{d.value}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="block">
        {inner}
      </Link>
    );
  }

  return inner;
}

// ── Skeleton ──────────────────────────────────────────────────

export function AllocationRowSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 rounded-lg border bg-card px-4 py-3.5">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-14 rounded-md" />
        <Skeleton className="ms-auto h-5 w-24" />
      </div>
      <Skeleton className="h-4 w-2/5" />
      <div className="flex gap-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
