"use client";
import { useParams } from "next/navigation";
import { JournalForTransaction } from "@/components/journal/journal-for-transaction";
import { useTransaction } from "@/hooks/admin/use-transaction";
import { TransactionInfoCard } from "../_components/transaction-info-card";

export default function TransactionDetailPage() {
  const { transactionId } = useParams();
  const { data: transaction, isLoading, error } = useTransaction(transactionId as string);

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
    <div className="container max-w-4xl mx-auto  sm:py-8 space-y-6 sm:space-y-6">
      <TransactionInfoCard transaction={transaction} />
      <JournalForTransaction transactionId={transaction.id} />
    </div>
  );
}
