"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { AllocateJournalPanel } from "@/components/journal/allocate-journal-panel";
import { JournalEntriesTable } from "@/components/journal/journal-entries-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogTitle } from "@/components/ui/dialog";
import { ResponsivePanel } from "@/components/ui/responsive-panel";
import { useJournals } from "@/hooks/use-journal";
import { useDeleteJournalEntry } from "@/hooks/use-journal-entries";
import { transactionKeys } from "@/hooks/use-transaction";
import { type JournalEntry, DEBIT_CREDIT_META } from "@/types/entities/journal-entry.type";
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
    <CardHeader className="border-b p-4 sm:p-6 space-y-3">
      {/* Top row: icon + title + status */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="size-5 text-muted-foreground shrink-0" />
          <CardTitle className="text-base sm:text-lg">ژورنال حسابداری</CardTitle>
        </div>
        <Badge variant={statusInfo.variant} className="text-xs shrink-0">
          {statusInfo.label}
        </Badge>
      </div>

      {/* Second row: code + allocation button */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">
          کد: <FormattedNumber type="normal" value={journal.code} className="" />
        </span>
        {showAllocationButton && <AllocateJournalPanel journal={journal} />}
      </div>

      {/* Note + posted date — compact grid on mobile */}
      {(journal.note ?? journal.postedAt) && (
        <div className="mt-3 pt-3 border-t grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
          {journal.note && (
            <div className="sm:col-span-2">
              <span className="font-medium">یادداشت:</span> {journal.note}
            </div>
          )}
          {journal.postedAt && (
            <div>
              <span className="font-medium">تاریخ ثبت:</span> <FormattedDate value={journal.postedAt} />
            </div>
          )}
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

  // Deletion state for removable entries
  const deleteMutation = useDeleteJournalEntry();
  const queryClient = useQueryClient();
  const [entryToDelete, setEntryToDelete] = React.useState<JournalEntry | null>(null);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const requestDelete = (entry: JournalEntry) => {
    setEntryToDelete(entry);
    setDeleteError(null);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    if (!entryToDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteMutation.mutateAsync(entryToDelete.id);

      // Invalidate the transaction detail the page uses (if available)
      if (journal.transactionId) {
        queryClient.invalidateQueries({ queryKey: transactionKeys.detail(journal.transactionId) });
      }

      // Also refresh transaction lists
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });

      // Also invalidate any journal-entries list for this journal id
      queryClient.invalidateQueries({ queryKey: ["journalEntries", { journalId: journal.id }] });

      setOpenDelete(false);
      setEntryToDelete(null);
    } catch {
      setDeleteError("خطا در حذف ثبت حسابداری");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card>
      <JournalCardHeader journal={journal} showAllocationButton={showAllocationButton} statusInfo={statusInfo} />
      <CardContent className="p-0">
        <JournalEntriesTable
          entries={journal.entries ?? []}
          totalDebit={totalDebit}
          totalCredit={totalCredit}
          onRequestDelete={requestDelete}
        />
      </CardContent>

      <ResponsivePanel open={openDelete} onOpenChange={setOpenDelete} variant="destructive">
        <div className="w-full">
          <DialogTitle className="pb-6">حذف ثبت حسابداری</DialogTitle>
          <p className="text-start text-sm">آیا مطمئن هستید که می‌خواهید این ثبت را حذف کنید؟</p>
          <p className="text-start text-sm">این عمل قابل بازگشت نیست.</p>
          {entryToDelete && (
            <div className="mt-4 text-sm">
              <div className="font-medium">حساب: {entryToDelete.ledgerAccount?.nameFa ?? "-"}</div>
              <div>مبلغ: {Number(entryToDelete.amount).toLocaleString("fa-IR")}</div>
              <div>نوع: {DEBIT_CREDIT_META[entryToDelete.dc].label}</div>
            </div>
          )}

          {deleteError && <div className="text-destructive text-sm mt-3">{deleteError}</div>}

          <div className="flex gap-2 justify-center mt-6">
            <Button variant="outline" onClick={() => setOpenDelete(false)} disabled={deleting}>
              انصراف
            </Button>

            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              حذف نهایی
            </Button>
          </div>
        </div>
      </ResponsivePanel>
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
