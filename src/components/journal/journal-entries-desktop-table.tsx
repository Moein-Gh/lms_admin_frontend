"use client";

import Link from "next/link";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import {
  DeleteIcon,
  CheckCircle2,
  AlertCircle,
  Hash,
  UserIcon,
  ArrowUpRight,
  CardIcon,
  CalendarIcon
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  entries: JournalEntry[];
  totalDebit: number;
  totalCredit: number;
  onRequestDelete?: (entry: JournalEntry) => void;
};

export function JournalEntriesDesktopTable({ entries, totalDebit, totalCredit, onRequestDelete }: Props) {
  const isBalanced = totalDebit === totalCredit;

  return (
    <div className="relative w-full overflow-auto rounded-xl bg-card border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="font-bold w-24">کد / تاریخ</TableHead>
            <TableHead className="font-bold min-w-32">حساب دفتری</TableHead>
            <TableHead className="font-bold w-48">جزئیات عضو</TableHead>
            <TableHead className="font-bold w-36">هدف</TableHead>
            <TableHead className="text-start font-bold">بدهکار</TableHead>
            <TableHead className="text-start font-bold">بستانکار</TableHead>
            <TableHead className="text-center font-bold w-16">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => {
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
              <TableRow
                key={entry.id}
                className={cn(
                  "hover:bg-muted/20 transition-colors align-top group",
                  isDebit ? "border-r-2 border-r-active/40" : "border-r-2 border-r-transparent"
                )}
              >
                {/* Code + Date */}
                <TableCell className="py-3 align-top">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <Hash className="size-3 text-muted-foreground shrink-0" />
                      <span className="text-sm font-semibold tabular-nums">{entry.code}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <FormattedDate value={entry.createdAt} />
                    </div>
                  </div>
                </TableCell>

                {/* Ledger account */}
                <TableCell className="py-3 align-top">
                  <div className="flex flex-col gap-1 max-w-[140px]">
                    <span className="font-medium text-sm truncate" title={entry.ledgerAccount?.nameFa}>
                      {entry.ledgerAccount?.nameFa ?? "—"}
                    </span>
                    {entry.ledgerAccount?.code && (
                      <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded w-fit text-center">
                        {entry.ledgerAccount.code}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* User / Account Details */}
                <TableCell className="py-3 align-top">
                  {userName || accountName ? (
                    <div className="flex flex-col gap-1.5 max-w-[180px]">
                      {userName && (
                        <div className="flex items-center gap-1.5">
                          <UserIcon className="size-3.5 text-muted-foreground shrink-0" />
                          {userLink ? (
                            <Link
                              href={userLink}
                              className="text-sm font-medium text-foreground hover:underline truncate"
                              title={userName}
                            >
                              {userName}
                            </Link>
                          ) : (
                            <span className="text-sm font-medium text-foreground truncate" title={userName}>
                              {userName}
                            </span>
                          )}
                        </div>
                      )}
                      {accountName && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CardIcon className="size-3 shrink-0 opacity-70" />
                          {accountLink ? (
                            <Link
                              href={accountLink}
                              className="hover:text-foreground hover:underline truncate"
                              title={accountName}
                            >
                              {accountName}
                            </Link>
                          ) : (
                            <span className="truncate" title={accountName}>
                              {accountName}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>

                {/* Target Details */}
                <TableCell className="py-3 align-middle">
                  {targetMeta ? (
                    <div className="flex items-center justify-center gap-1.5">
                      <Badge
                        variant={targetMeta.variant}
                        className="text-[10px] px-1.5 h-5 font-normal whitespace-nowrap"
                      >
                        {targetMeta.label}
                      </Badge>
                      {targetCode && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {targetLink ? (
                            <Link
                              href={targetLink}
                              className="flex items-center gap-1 font-mono hover:text-primary transition-colors"
                            >
                              {targetCode}
                              <ArrowUpRight className="size-3" />
                            </Link>
                          ) : (
                            <span className="font-mono">{targetCode}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>

                {/* Debit */}
                <TableCell className="text-start tabular-nums py-3 align-middle">
                  {isDebit ? (
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-bold text-active tabular-nums">
                        <FormattedNumber type="price" value={entry.amount} />
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground/30 text-lg select-none px-4">—</span>
                  )}
                </TableCell>

                {/* Credit */}
                <TableCell className="text-start tabular-nums py-3 align-middle">
                  {!isDebit ? (
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-bold text-foreground tabular-nums">
                        <FormattedNumber type="price" value={entry.amount} />
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground/30 text-lg select-none px-4">—</span>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-center py-3 align-top">
                  <div className="flex items-center justify-center gap-1">
                    <JournalEntryInfoButton entry={entry} />
                    {entry.removable && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onRequestDelete?.(entry)}
                        aria-label="حذف ثبت"
                      >
                        <DeleteIcon className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}

          {/* Totals row */}
          <TableRow className="bg-muted/30 font-bold border-t-2 border-border hover:bg-muted/30">
            <TableCell colSpan={4} className="text-start text-sm py-3">
              <div className="flex items-center gap-2 px-4">
                <span>جمع کل</span>
                {isBalanced ? (
                  <Badge variant="active" className="gap-1 font-normal">
                    <CheckCircle2 className="size-3" />
                    تراز
                  </Badge>
                ) : (
                  <Badge variant="warning" className="gap-1 font-normal">
                    <AlertCircle className="size-3" />
                    عدم تراز
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell className="text-start tabular-nums text-sm py-3">
              <span className="text-active font-bold">
                <FormattedNumber type="price" value={totalDebit} />
              </span>
            </TableCell>
            <TableCell className="text-start tabular-nums text-sm py-3">
              <FormattedNumber type="price" value={totalCredit} />
            </TableCell>
            {!isBalanced && (
              <TableCell colSpan={1} className="text-sm text-warning py-3">
                اختلاف:{" "}
                <span className="font-bold tabular-nums">
                  <FormattedNumber type="price" value={Math.abs(totalDebit - totalCredit)} />
                </span>
              </TableCell>
            )}
            {isBalanced && <TableCell colSpan={1} />}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
