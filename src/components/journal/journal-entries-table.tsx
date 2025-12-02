"use client";

import Link from "next/link";
import { ArrowUpRight, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { type JournalEntry, JournalEntryTarget, JOURNAL_ENTRY_TARGET_META } from "@/types/entities/journal-entry.type";

function getTargetLink(type: JournalEntryTarget, id: string): string | null {
  switch (type) {
    case JournalEntryTarget.ACCOUNT:
      return `/dashboard/accounts/${id}`;
    case JournalEntryTarget.LOAN:
      return `/dashboard/loans/${id}`;
    default:
      return null;
  }
}

/* ─────────────────────────────────────────────────────────────
   Mobile-first entry card (visible < md)
   ───────────────────────────────────────────────────────────── */
function JournalEntryCard({
  entry,
  onRequestDelete
}: {
  entry: JournalEntry;
  onRequestDelete?: (entry: JournalEntry) => void;
}) {
  const targetLink = entry.targetType && entry.targetId ? getTargetLink(entry.targetType, entry.targetId) : null;

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      {/* Header: code + account name on single row, delete button on the right */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <p className="font-semibold text-sm leading-tight truncate">{entry.ledgerAccount?.nameFa ?? "-"}</p>
          <p className="text-xs text-muted-foreground font-mono">
            کد: <FormattedNumber value={entry.ledgerAccount?.code ?? "-"} type="normal" />
          </p>
        </div>
        {entry.removable && (
          <Button
            variant="destructive"
            size="icon"
            className="shrink-0 h-8 w-8"
            onClick={() => onRequestDelete?.(entry)}
            aria-label="حذف ثبت"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Target badge + link */}
      {entry.targetType && (
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={JOURNAL_ENTRY_TARGET_META[entry.targetType].variant} className="text-xs font-normal">
            {JOURNAL_ENTRY_TARGET_META[entry.targetType].label}
          </Badge>
          {targetLink ? (
            <Link href={targetLink} className="flex items-center gap-1 text-xs text-primary hover:underline">
              <span className="font-mono">کد:{entry.target?.code}</span>
              <ArrowUpRight className="size-3" />
            </Link>
          ) : (
            entry.targetId && (
              <span className="text-xs text-muted-foreground font-mono">{entry.targetId.slice(0, 8)}...</span>
            )
          )}
        </div>
      )}

      {/* Debit / Credit row */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">بدهکار</span>
          <p className="font-semibold tabular-nums">
            {entry.dc === "DEBIT" ? (
              <FormattedNumber type="price" value={entry.amount} />
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </p>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">بستانکار</span>
          <p className="font-semibold tabular-nums">
            {entry.dc === "CREDIT" ? (
              <FormattedNumber type="price" value={entry.amount} />
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Desktop table (visible >= md)
   ───────────────────────────────────────────────────────────── */
function JournalEntriesDesktopTable({
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
  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="font-bold">کد حساب</TableHead>
            <TableHead className="font-bold">نام حساب</TableHead>
            <TableHead className="font-bold">هدف (Target)</TableHead>
            <TableHead className="text-start font-bold">بدهکار</TableHead>
            <TableHead className="text-start font-bold">بستانکار</TableHead>
            <TableHead className="text-center font-bold">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry: JournalEntry) => {
            const targetLink =
              entry.targetType && entry.targetId ? getTargetLink(entry.targetType, entry.targetId) : null;
            return (
              <TableRow key={entry.id} className="hover:bg-muted/20 transition-colors">
                <TableCell className="text-muted-foreground">
                  <FormattedNumber value={entry.ledgerAccount?.code ?? "-"} type="normal" />
                </TableCell>
                <TableCell className="font-medium">{entry.ledgerAccount?.nameFa ?? "-"}</TableCell>
                <TableCell>
                  {entry.targetType ? (
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={JOURNAL_ENTRY_TARGET_META[entry.targetType].variant}
                        className="text-xs font-normal"
                      >
                        {JOURNAL_ENTRY_TARGET_META[entry.targetType].label}
                      </Badge>
                      {targetLink ? (
                        <Link
                          href={targetLink}
                          className="flex items-center gap-1 text-xs text-primary hover:underline"
                          title={`مشاهده ${JOURNAL_ENTRY_TARGET_META[entry.targetType].label}`}
                        >
                          <span className="font-mono">کد:{entry.target?.code}</span>
                          <ArrowUpRight className="size-3" />
                        </Link>
                      ) : (
                        entry.targetId && (
                          <span className="text-xs text-muted-foreground font-mono">
                            {entry.targetId.slice(0, 8)}...
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">-</span>
                  )}
                </TableCell>
                <TableCell className="text-start tabular-nums">
                  {entry.dc === "DEBIT" ? (
                    <span className="font-semibold">
                      <FormattedNumber type="price" value={entry.amount} />
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-start tabular-nums">
                  {entry.dc === "CREDIT" ? (
                    <span className="font-semibold">
                      <FormattedNumber type="price" value={entry.amount} />
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {entry.removable ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onRequestDelete?.(entry)}
                      aria-label="حذف ثبت"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow className="bg-accent/50 font-bold border-t-2 border-border">
            <TableCell colSpan={3} className="text-start text-base">
              جمع کل
            </TableCell>
            <TableCell className="text-start tabular-nums text-base">
              <FormattedNumber type="price" value={totalDebit} />
            </TableCell>
            <TableCell className="text-start tabular-nums text-base">
              <FormattedNumber type="price" value={totalCredit} />
            </TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Responsive wrapper: cards on mobile, table on md+
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
    return <div className="p-8 text-center text-muted-foreground">هیچ ثبت حسابداری ای ثبت نشده است.</div>;
  }

  const isBalanced = totalDebit === totalCredit;

  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 p-4 md:hidden">
        {entries.map((entry) => (
          <JournalEntryCard key={entry.id} entry={entry} onRequestDelete={onRequestDelete} />
        ))}

        {/* Totals card — stacked vertically for easy balance comparison */}
        <div
          className={cn(
            "rounded-lg border p-4",
            isBalanced ? "bg-active/10 border-active/30" : "bg-warning/10 border-warning/30"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold">جمع کل</p>
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

          {/* Stacked layout for easy comparison */}
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">بدهکار</span>
              <p className="font-bold tabular-nums">
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
      </div>

      {/* Desktop: table */}
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
