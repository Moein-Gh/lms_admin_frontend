"use client";
import { useParams } from "next/navigation";
import { useLoan } from "@/hooks/use-loan";
import { LoanInfoCard } from "../_components/loan-info-card";
import { LoanInstallmentsSection } from "../_components/loan-installments-section";

export default function LoanDetailPage() {
  const { loanId } = useParams();
  const { data: loan, isLoading, error } = useLoan(loanId as string);

  if (isLoading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div>خطا در بارگذاری داده‌های کاربر</div>;
  }

  if (!loan) {
    return <div>کاربر یافت نشد</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto  sm:py-8 space-y-6 sm:space-y-8">
      <LoanInfoCard loan={loan} />
      <LoanInstallmentsSection loanId={loan.id} />
    </div>
  );
}
