"use client";

import { FormattedNumber } from "@/components/formatted-number";
import { CheckCircle2, AlertCircle } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type JournalEntry } from "@/types/entities/journal-entry.type";
import { JournalEntriesDesktopTable } from "./journal-entries-desktop-table";
import { JournalEntryMobileCard } from "./journal-entry-mobile-card";

/* ─────────────────────────────────────────────────────────────
   Mobile totals summary card
   ───────────────────────────────────────────────────────────── */
function MobileTotalsCard({ totalDebit, totalCredit }: { totalDebit: number; totalCredit: number }) {
  const isBalanced = totalDebit === totalCredit;
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        isBalanced ? "bg-active/8 border-active/30" : "bg-warning/8 border-warning/30"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-sm">جمع کل</p>
        {isBalanced ? (
          <Badge variant="active" className="gap-1">
            <CheckCircle2 className="size-3" />
            تراز
          </Badge>
        ) : (
          <Badge variant="warning" className="gap-1">
            <AlertCircle className="size-3" />
            عدم تراز
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-sm text-muted-foreground">بدهکار</span>
          <p className="font-bold tabular-nums text-active">
            <FormattedNumber type="price" value={totalDebit} />
          </p>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-muted-foreground">بستانکار</span>
          <p className="font-bold tabular-nums">
            <FormattedNumber type="price" value={totalCredit} />
          </p>
        </div>
        {!isBalanced && (
          <div className="flex items-center justify-between pt-2 border-t border-dashed">
            <span className="text-sm font-medium text-warning">اختلاف</span>
            <p className="font-bold tabular-nums text-warning">
              <FormattedNumber type="price" value={Math.abs(totalDebit - totalCredit)} />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Responsive wrapper — exported public API
   ───────────────────────────────────────────────────────────── */
export function JournalEntriesTable({
  entries,
  totalDebit,
  totalCredit,
  onRequestDelete
}: {
  entries: JournalEntry[];
  totalDebit: number;
  totalCredit: number;
  onRequestDelete?: (entry: JournalEntry) => void;
}) {
  if (entries.length === 0) {
    return <div className="p-8 text-center text-muted-foreground text-sm">هیچ ثبت حسابداری‌ای وجود ندارد.</div>;
  }

  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 p-4 md:hidden">
        {entries.map((entry) => (
          <JournalEntryMobileCard key={entry.id} entry={entry} onRequestDelete={onRequestDelete} />
        ))}
        <MobileTotalsCard totalDebit={totalDebit} totalCredit={totalCredit} />
      </div>

      {/* Desktop: full table */}
      <div className="hidden md:block">
        <JournalEntriesDesktopTable
          entries={entries}
          totalDebit={totalDebit}
          totalCredit={totalCredit}
          onRequestDelete={onRequestDelete}
        />
      </div>
    </>
  );
}
