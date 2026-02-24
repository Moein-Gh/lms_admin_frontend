"use client";

import { useState } from "react";
import Link from "next/link";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { InfoIcon, Hash, Clock, UserIcon, BankIcon, CardIcon, CalendarIcon, ArrowUpRight } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DrawerHeader, DrawerTitle, DrawerDescription, DrawerBody } from "@/components/ui/drawer";
import { ResponsivePanel } from "@/components/ui/responsive-panel";
import { useIsMobile } from "@/hooks/general/use-mobile";
import { cn } from "@/lib/utils";
import {
  type JournalEntry,
  DebitCredit,
  DEBIT_CREDIT_META,
  JOURNAL_ENTRY_TARGET_META
} from "@/types/entities/journal-entry.type";
import { SUBSCRIPTION_FEE_STATUS_LABEL, SubscriptionFeeStatus } from "@/types/entities/subscription-fee.type";
import { getTargetLink, getTargetCode, isSubscriptionFee } from "./journal-entry-utils";

/* ── Shared detail content ──────────────────────────────────── */
function JournalEntryDetailContent({ entry, isMobile = false }: { entry: JournalEntry; isMobile?: boolean }) {
  const isDebit = entry.dc === DebitCredit.DEBIT;
  const dcMeta = DEBIT_CREDIT_META[entry.dc];

  const userName = entry.account?.user?.identity.name;
  const userCode = entry.account?.user?.code;
  const accountName = entry.account?.name;
  const accountBookCode = entry.account?.bookCode;
  const userLink = entry.account?.user?.id ? `/admin/users/${entry.account.user.id}` : null;
  const accountLink = entry.account?.id ? `/admin/accounts/${entry.account.id}` : null;

  const targetMeta = entry.targetType ? JOURNAL_ENTRY_TARGET_META[entry.targetType] : null;
  const targetCode = getTargetCode(entry);
  const targetLink =
    entry.targetType && entry.targetId ? getTargetLink(entry.targetType, entry.targetId, entry.target) : null;
  const fee = isSubscriptionFee(entry.target) ? entry.target : null;

  return (
    <div
      className={cn(
        "w-full flex flex-col overflow-hidden transition-all bg-card",
        isMobile ? "border-0 shadow-none rounded-none" : "rounded-xl border shadow-sm",
        isDebit
          ? isMobile
            ? "border-t-4 border-t-orange-500/50"
            : "border-l-4 border-l-orange-500/50"
          : isMobile
            ? "border-t-4 border-t-emerald-500/50"
            : "border-l-4 border-l-emerald-500/50"
      )}
    >
      {/* ── Top Section: General Info (Amount, Time, Type) ── */}
      <div
        className={cn(
          "flex items-center justify-between bg-muted/20 border-b border-border/40",
          isMobile ? "px-4 py-3" : "px-4 py-3"
        )}
      >
        {/* Left: Date/Time/Code */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground/90">
          <div className="flex items-center gap-1.5 font-mono opacity-80">
            <Hash className="size-3.5 opacity-70" />
            <span>{entry.code}</span>
          </div>
          <div className="w-px h-3 bg-border" />
          <div className="flex items-center gap-1.5 direction-ltr">
            <FormattedDate value={entry.createdAt} format="MMMM yyyy" />
            <CalendarIcon className="size-3.5 opacity-70" />
          </div>
          {/* Show time on desktop only to save space on mobile, or keep if fits */}
          <div className="hidden sm:block w-px h-3 bg-border" />
          <div className="hidden sm:flex items-center gap-1.5 opacity-80">
            <Clock className="size-3.5" />
            <FormattedDate value={entry.createdAt} format="HH:mm" />
          </div>
        </div>
        {/* Right: Badge */}
        <Badge variant={isDebit ? "active" : "outline"} className="h-5 px-2 text-[10px] font-normal">
          {dcMeta.label}
        </Badge>
      </div>

      {/* ── Main Content Body ── */}
      <div className={cn("flex flex-col gap-6", isMobile ? "p-4" : "p-5")}>
        {/* 1. General Info (Amount Highlight) */}
        <div className="flex flex-col items-center justify-center py-2">
          <span className="text-xs text-muted-foreground mb-1">مبلغ کل تراکنش</span>
          <div
            className={cn(
              "font-black tracking-tight tabular-nums flex items-baseline gap-1.5",
              isDebit ? "text-orange-600 dark:text-orange-400" : "text-emerald-600 dark:text-emerald-400",
              isMobile ? "text-3xl" : "text-4xl"
            )}
          >
            <FormattedNumber type="price" value={entry.amount} />
          </div>
        </div>

        <div className="h-px w-full bg-border/40" />

        {/* 2. User Info & Account Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* User Info Block */}
          <div className="flex flex-col gap-3 p-3 rounded-lg bg-muted/10 border border-border/30">
            <div className="flex items-center gap-2 text-muted-foreground border-b border-border/30 pb-2">
              <UserIcon className="size-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">اطلاعات کاربر</span>
            </div>

            {userName ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">نام:</span>
                  {userLink ? (
                    <Link
                      href={userLink}
                      className="text-sm font-bold text-foreground hover:underline truncate max-w-[150px]"
                    >
                      {userName}
                    </Link>
                  ) : (
                    <span className="text-sm font-bold text-foreground truncate">{userName}</span>
                  )}
                </div>
                {userCode && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">کد کاربر:</span>
                    <span className="font-mono text-xs">{userCode}</span>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground italic text-center py-2">کاربر نامشخص</span>
            )}
          </div>

          {/* Account Info Block */}
          <div className="flex flex-col gap-3 p-3 rounded-lg bg-muted/10 border border-border/30">
            <div className="flex items-center gap-2 text-muted-foreground border-b border-border/30 pb-2">
              <CardIcon className="size-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">اطلاعات حساب</span>
            </div>

            {accountName ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">عنوان:</span>
                  {accountLink ? (
                    <Link
                      href={accountLink}
                      className="text-sm font-bold text-foreground hover:underline truncate max-w-[150px]"
                    >
                      {accountName}
                    </Link>
                  ) : (
                    <span className="text-sm font-bold text-foreground truncate">{accountName}</span>
                  )}
                </div>
                {accountBookCode && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">کد دفتر:</span>
                    <span className="font-mono text-xs">{accountBookCode}</span>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground italic text-center py-2">حساب نامشخص</span>
            )}
          </div>
        </div>

        {/* 3. Journal Entry Info (Ledger) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground px-1">
            <BankIcon className="size-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">اطلاعات دفتر روزنامه</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/30">
            <span className="text-xs text-muted-foreground">حساب معین (بانک/صندوق):</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-foreground truncate max-w-[150px]">
                {entry.ledgerAccount?.nameFa ?? "—"}
              </span>
              {entry.ledgerAccount?.code && (
                <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-mono">
                  {entry.ledgerAccount.code}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* 4. Target Info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground px-1">
            <InfoIcon className="size-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">هدف / بابت</span>
          </div>

          {targetMeta ? (
            <div className="flex flex-col gap-2 p-3 bg-muted/20 rounded-lg border border-border/30">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">نوع هدف:</span>
                <Badge variant={targetMeta.variant} className="text-[10px] h-5 px-2 font-normal">
                  {targetMeta.label}
                </Badge>
              </div>

              <div className="flex items-center justify-between border-t border-border/30 pt-2 mt-1">
                <span className="text-xs text-muted-foreground">شناسه ارجاع:</span>
                {targetCode ? (
                  <div className="flex items-center gap-1.5">
                    {targetLink ? (
                      <Link
                        href={targetLink}
                        className="font-mono text-sm text-primary hover:underline truncate dir-ltr"
                      >
                        {targetCode}
                      </Link>
                    ) : (
                      <span className="font-mono text-sm truncate dir-ltr">{targetCode}</span>
                    )}
                    {targetLink && <ArrowUpRight className="size-3 text-primary/50" />}
                  </div>
                ) : (
                  <span className="text-xs italic text-muted-foreground">ندارد</span>
                )}
              </div>

              {/* Extra Fee Details */}
              {isSubscriptionFee(entry.target) && fee && (
                <div className="mt-2 bg-background/50 rounded p-2 text-xs flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">وضعیت:</span>
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px]",
                        fee.status === SubscriptionFeeStatus.PAID
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : fee.status === SubscriptionFeeStatus.DUE
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      {SUBSCRIPTION_FEE_STATUS_LABEL[fee.status]}
                    </span>
                  </div>
                  {fee.periodStart && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">دوره:</span>
                      <FormattedDate value={fee.periodStart} format="MMMM yyyy" />
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-muted/10 border border-dashed text-center text-xs text-muted-foreground rounded-lg">
              اطلاعات هدف ثبت نشده است
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Panel header — different markup for Dialog vs Drawer ───── */
function DesktopHeader({ entry }: { entry: JournalEntry }) {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2 text-base">
        <Hash className="size-4 text-muted-foreground" />
        <span>ثبت</span>
        <span className="tabular-nums">{entry.code}</span>
      </DialogTitle>
      <DialogDescription className="sr-only">جزئیات کامل ثبت حسابداری</DialogDescription>
    </DialogHeader>
  );
}

function MobileHeader({ entry }: { entry: JournalEntry }) {
  return (
    <DrawerHeader className="text-start pb-2">
      <DrawerTitle className="flex items-center gap-2">
        <Hash className="size-4 text-muted-foreground" />
        <span>ثبت</span>
        <span className="tabular-nums">{entry.code}</span>
      </DrawerTitle>
      <DrawerDescription className="sr-only">جزئیات کامل ثبت حسابداری</DrawerDescription>
    </DrawerHeader>
  );
}

/* ── Exported button + panel ────────────────────────────────── */
export function JournalEntryInfoButton({ entry }: { entry: JournalEntry }) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
        onClick={() => setOpen(true)}
        aria-label="جزئیات ثبت"
      >
        <InfoIcon className="size-4" />
      </Button>

      <ResponsivePanel open={open} onOpenChange={setOpen}>
        {isMobile ? <MobileHeader entry={entry} /> : <DesktopHeader entry={entry} />}

        {isMobile ? (
          <DrawerBody className="p-0">
            {" "}
            {/* Remove default padding to allow full width */}
            <JournalEntryDetailContent entry={entry} isMobile={true} />
          </DrawerBody>
        ) : (
          <div className="overflow-y-auto max-h-[75vh] px-1">
            <JournalEntryDetailContent entry={entry} isMobile={false} />
          </div>
        )}
      </ResponsivePanel>
    </>
  );
}
