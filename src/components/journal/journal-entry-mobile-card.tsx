"use client";

import Link from "next/link";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { DeleteIcon, UserIcon, CardIcon, BankIcon, CalendarIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type JournalEntry,
  DebitCredit,
  DEBIT_CREDIT_META,
  JOURNAL_ENTRY_TARGET_META
} from "@/types/entities/journal-entry.type";
import { JournalEntryInfoButton } from "./journal-entry-detail-panel";
import { getTargetLink, getTargetCode } from "./journal-entry-utils";

type Props = {
  entry: JournalEntry;
  onRequestDelete?: (entry: JournalEntry) => void;
};

export function JournalEntryMobileCard({ entry, onRequestDelete }: Props) {
  const isDebit = entry.dc === DebitCredit.DEBIT;
  const dcMeta = DEBIT_CREDIT_META[entry.dc];

  // Extract User/Account Info
  const userName = entry.account?.user?.identity.name;
  const accountName = entry.account?.name;
  const userLink = entry.account?.user?.id ? `/admin/users/${entry.account.user.id}` : null;
  const accountLink = entry.account?.id ? `/admin/accounts/${entry.account.id}` : null;

  // Extract Target Info
  const targetMeta = entry.targetType ? JOURNAL_ENTRY_TARGET_META[entry.targetType] : null;
  const targetCode = getTargetCode(entry);
  const targetLink =
    entry.targetType && entry.targetId ? getTargetLink(entry.targetType, entry.targetId, entry.target) : null;

  return (
    <div className="relative flex flex-col rounded-xl border bg-card shadow-sm overflow-hidden transition-all">
      {/* ── Top Section: Meta & Actions ── */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/20 border-b border-border/40">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground/80">
          <div className="flex items-center gap-1.5">
            <span className="font-mono opacity-70">#{entry.code}</span>
          </div>
          <div className="w-px h-3 bg-border" />
          <div className="flex items-center gap-1">
            <CalendarIcon className="size-3 opacity-70" />
            <FormattedDate value={entry.createdAt} />
          </div>
        </div>

        <div className="flex items-center gap-1 -my-1">
          <JournalEntryInfoButton entry={entry} />
          {entry.removable && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => onRequestDelete?.(entry)}
            >
              <DeleteIcon className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="p-3.5 flex flex-col gap-3">
        {/* Row 1: Who vs Amount */}
        <div className="flex items-start justify-between gap-4">
          {/* Left: User/Account Identity */}
          <div className="flex flex-col min-w-0 gap-1 pt-0.5">
            {(userName ?? accountName) ? (
              <>
                {userName && (
                  <div className="flex items-center gap-1.5">
                    <UserIcon className="size-3.5 text-muted-foreground" />
                    {userLink ? (
                      <Link href={userLink} className="text-sm font-bold text-foreground truncate block max-w-40">
                        {userName}
                      </Link>
                    ) : (
                      <span className="text-sm font-bold text-foreground truncate block max-w-40">{userName}</span>
                    )}
                  </div>
                )}
                {accountName && (
                  <div className="flex items-center gap-1.5">
                    <CardIcon className="size-3 text-muted-foreground/70" />
                    {accountLink ? (
                      <Link href={accountLink} className="text-xs text-muted-foreground truncate block max-w-40">
                        {accountName}
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground truncate block max-w-40">{accountName}</span>
                    )}
                  </div>
                )}
              </>
            ) : (
              <span className="text-sm text-muted-foreground italic">بدون نام</span>
            )}
          </div>

          {/* Right: Amount - The "Hero" */}
          <div className="flex flex-col items-end shrink-0">
            <div
              className={cn(
                "text-lg font-black tracking-tight tabular-nums flex items-baseline gap-1",
                isDebit ? "text-orange-600 dark:text-orange-400" : "text-emerald-600 dark:text-emerald-400"
              )}
            >
              <FormattedNumber type="price" value={entry.amount} />
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">{dcMeta.label}</span>
          </div>
        </div>

        {/* Separator / Context */}
        <div className="h-px w-full bg-border/40" />

        {/* Row 2: Context Details (Ledger & Target) */}
        <div className="flex items-center justify-between gap-2 text-xs">
          {/* Ledger Account (Bank/Fund) */}
          <div className="flex items-center gap-1.5 text-muted-foreground/90 bg-secondary/30 px-2 py-1 rounded-md max-w-[75%]">
            <BankIcon className="size-3  opacity-70" />
            <span>{entry.ledgerAccount?.nameFa ?? "—"}</span>
          </div>

          {/* Target (Invoice/Loan/etc) */}
          {targetMeta && (
            <div className="flex items-center gap-1.5 pl-1 max-w-[48%] justify-end">
              <span className="text-[10px] text-muted-foreground shrink-0">{targetMeta.label}:</span>
              {targetLink ? (
                <Link href={targetLink} className="font-mono text-primary hover:underline truncate">
                  {targetCode}
                </Link>
              ) : (
                <span className="font-mono text-foreground truncate">{targetCode}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
