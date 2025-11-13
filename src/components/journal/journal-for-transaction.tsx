"use client";

import * as React from "react";
import { FileText } from "lucide-react";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { AllocateJournalPanel } from "@/components/journal/allocate-journal-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useJournals } from "@/hooks/use-journal";
import type { JournalEntry } from "@/types/entities/journal-entry.type";
import type { Journal, JournalStatus } from "@/types/entities/journal.type";

type Props = {
  transactionId: string;
};

function getStatusLabel(status: JournalStatus): { label: string; variant: "active" | "outline" | "inactive" } {
  switch (status) {
    case "POSTED":
      return { label: "ثبت شده", variant: "active" };
    case "PENDING":
      return { label: "در انتظار", variant: "outline" };
    case "VOIDED":
      return { label: "لغو شده", variant: "inactive" };
    default:
      return { label: "نامشخص", variant: "outline" };
  }
}

function JournalEntriesTable({
  entries,
  totalDebit,
  totalCredit
}: {
  entries: JournalEntry[];
  totalDebit: number;
  totalCredit: number;
}) {
  if (entries.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">هیچ ثبت حسابداری ای ثبت نشده است.</div>;
  }

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            {/* Hide ledger account code on mobile */}
            <TableHead className="font-bold hidden sm:table-cell">کد حساب</TableHead>
            <TableHead className="font-bold">نام حساب</TableHead>
            <TableHead className="text-start font-bold">بدهکار</TableHead>
            <TableHead className="text-start font-bold">بستانکار</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry: JournalEntry) => (
            <TableRow key={entry.id} className="hover:bg-muted/20 transition-colors">
              {/* Hide ledger account code on mobile */}
              <TableCell className="text-muted-foreground hidden sm:table-cell">
                <FormattedNumber value={entry.ledgerAccount?.code ?? "-"} useGrouping={false} />
              </TableCell>
              <TableCell className="font-medium">{entry.ledgerAccount?.nameFa ?? "-"}</TableCell>
              <TableCell className="text-start tabular-nums">
                {entry.dc === "DEBIT" ? (
                  <span className="font-semibold">
                    <FormattedNumber value={entry.amount} />
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-start tabular-nums">
                {entry.dc === "CREDIT" ? (
                  <span className="font-semibold">
                    <FormattedNumber value={entry.amount} />
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-accent/50 font-bold border-t-2 border-border">
            {/* Hide ledger account code on mobile */}
            <TableCell colSpan={2} className="text-start text-base hidden sm:table-cell">
              جمع کل
            </TableCell>
            <TableCell colSpan={1} className="text-start text-base sm:hidden">
              جمع کل
            </TableCell>
            <TableCell className="text-start tabular-nums text-base">
              <FormattedNumber value={totalDebit} />
            </TableCell>
            <TableCell className="text-start tabular-nums text-base">
              <FormattedNumber value={totalCredit} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

function JournalCardHeader({
  journal,
  showAllocationButton,
  statusInfo
}: {
  journal: Journal;
  showAllocationButton: boolean;
  statusInfo: { label: string; variant: "active" | "outline" | "inactive" };
}) {
  return (
    <CardHeader className="border-b">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <FileText className="size-5 text-muted-foreground" />
          <div>
            <CardTitle className="text-lg">ژورنال حسابداری</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <span>کد:</span>
              <span className="">
                <FormattedNumber value={journal.code} />
              </span>
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          {showAllocationButton && <AllocateJournalPanel journal={journal} />}
        </div>
      </div>
      {journal.note && (
        <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
          <span className="font-medium">یادداشت:</span> {journal.note}
        </div>
      )}
      {journal.postedAt && (
        <div className="mt-2 text-sm text-muted-foreground">
          <span className="font-medium">تاریخ ثبت:</span> <FormattedDate value={journal.postedAt} />
        </div>
      )}
    </CardHeader>
  );
}

function JournalCard({ journal }: { journal: Journal }) {
  const statusInfo = getStatusLabel(journal.status);
  const totalDebit =
    journal.entries?.reduce((sum, entry) => (entry.dc === "DEBIT" ? sum + Number(entry.amount) : sum), 0) ?? 0;
  const totalCredit =
    journal.entries?.reduce((sum, entry) => (entry.dc === "CREDIT" ? sum + Number(entry.amount) : sum), 0) ?? 0;

  // Check if ledger account 2050 exists and is unbalanced
  const account2050Entries = journal.entries?.filter((entry) => entry.ledgerAccount?.code === "2050") ?? [];
  const totalDebit2050 = account2050Entries.reduce(
    (sum, entry) => (entry.dc === "DEBIT" ? sum + Number(entry.amount) : sum),
    0
  );
  const totalCredit2050 = account2050Entries.reduce(
    (sum, entry) => (entry.dc === "CREDIT" ? sum + Number(entry.amount) : sum),
    0
  );
  const showAllocationButton = account2050Entries.length > 0 && totalDebit2050 !== totalCredit2050;

  return (
    <Card>
      <JournalCardHeader journal={journal} showAllocationButton={showAllocationButton} statusInfo={statusInfo} />
      <CardContent className="p-0">
        <JournalEntriesTable entries={journal.entries ?? []} totalDebit={totalDebit} totalCredit={totalCredit} />
      </CardContent>
    </Card>
  );
}

export const JournalForTransaction: React.FC<Props> = ({ transactionId }) => {
  const { data, isLoading, error } = useJournals({ transactionId, includeEntries: true });
  const journal: Journal | undefined = data?.data[0];

  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardContent className="p-8 text-center text-muted-foreground">در حال بارگذاری ژورنال...</CardContent>
      </Card>
    );
  }
  if (error) {
    return (
      <Card className="mt-4">
        <CardContent className="p-8 text-center text-destructive">خطا در بارگذاری ژورنال</CardContent>
      </Card>
    );
  }
  if (!journal) {
    return (
      <Card className="mt-4">
        <CardContent className="p-8 text-center text-muted-foreground">
          ژورنالی برای این تراکنش ثبت نشده است.
        </CardContent>
      </Card>
    );
  }

  return <JournalCard journal={journal} />;
};
