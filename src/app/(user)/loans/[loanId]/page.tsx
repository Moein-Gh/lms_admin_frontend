"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoan } from "@/hooks/admin/use-loan";
import { PageHeader } from "../../_components/page-header";
import { UserLoanInfoCard } from "../_components/user-loan-info-card";
import { UserLoanInstallmentsSection } from "../_components/user-loan-installments-section";

export default function UserLoanDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loanId } = useParams();
  const { data: loan, isLoading, error } = useLoan(loanId as string);

  const handleBack = () => {
    const backUrl = searchParams.get("back");
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-4 sm:py-8">
        <div className="text-center text-muted-foreground">در حال بارگذاری...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto p-4 sm:py-8">
        <div className="text-center text-destructive">خطا در بارگذاری اطلاعات وام</div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="container max-w-4xl mx-auto p-4 sm:py-8">
        <div className="text-center text-muted-foreground">وام یافت نشد</div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <PageHeader icon={CreditCard} title="جزئیات وام" subtitle="مشاهده اطلاعات و اقساط وام" />

      {/* Loan Info Card */}
      <UserLoanInfoCard loan={loan} />

      {/* Installments Section */}
      <UserLoanInstallmentsSection loanId={loan.id} />
    </div>
  );
}
