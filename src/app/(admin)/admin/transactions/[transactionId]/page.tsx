"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import { FileText, ReceiptText } from "@/components/icons";
import { JournalForTransaction } from "@/components/journal/journal-for-transaction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTransaction } from "@/hooks/admin/use-transaction";
import { TransactionStatus } from "@/types/entities/transaction.type";
import { TransactionAllocationSummary } from "../_components/transaction-allocation-summary";
import { TransactionInfoCard } from "../_components/transaction-info-card";

type SecondPanelView = "summary" | "journal";

export default function TransactionDetailPage() {
  const { transactionId } = useParams();
  const { data: transaction, isLoading, error } = useTransaction(transactionId as string);

  const isApproved = transaction?.status === TransactionStatus.APPROVED;
  const [view, setView] = React.useState<SecondPanelView>("summary");

  // Keep default in sync if approval status changes (e.g. after approving on this page)
  React.useEffect(() => {
    setView(isApproved ? "summary" : "journal");
  }, [isApproved]);

  if (isLoading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div>خطا در بارگذاری داده‌های کاربر</div>;
  }

  if (!transaction) {
    return <div>کاربر یافت نشد</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto sm:py-8 space-y-6">
      <TransactionInfoCard transaction={transaction} />

      {/* ── Second panel ── */}
      <Card className="overflow-hidden py-0 gap-0">
        {/* Header with toggle (toggle only when approved) */}
        <CardHeader className="flex flex-row items-center justify-between gap-3 p-4 border-b">
          <p className="text-sm font-semibold text-foreground">
            {!isApproved || view === "journal" ? "سند حسابداری" : "نحوه تخصیص وجه"}
          </p>

          {isApproved && (
            <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-0.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView("summary")}
                data-active={view === "summary"}
                className="h-7 px-2.5 text-xs gap-1.5 data-[active=true]:bg-background data-[active=true]:shadow-sm data-[active=true]:text-foreground text-muted-foreground"
              >
                <ReceiptText className="size-3.5" />
                تخصیص وجه
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView("journal")}
                data-active={view === "journal"}
                className="h-7 px-2.5 text-xs gap-1.5 data-[active=true]:bg-background data-[active=true]:shadow-sm data-[active=true]:text-foreground text-muted-foreground"
              >
                <FileText className="size-3.5" />
                سند حسابداری
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {/* Locked state: not approved yet */}
          {!isApproved && (
            <div className="py-4">
              <JournalForTransaction transactionId={transaction.id} />
            </div>
          )}

          {/* Approved: show based on selected view */}
          {isApproved && view === "summary" && (
            <div className="p-4">
              <TransactionAllocationSummary transactionId={transaction.id} />
            </div>
          )}
          {isApproved && view === "journal" && (
            <div className="py-4">
              <JournalForTransaction transactionId={transaction.id} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
