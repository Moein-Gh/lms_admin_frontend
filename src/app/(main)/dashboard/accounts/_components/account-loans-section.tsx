import { EmptyStateCard } from "@/components/empty-state-card";
import { useLoans } from "@/hooks/use-loan";
import type { Loan } from "@/types/entities/loan.type";
import { LoanCard } from "./loan-card";

export function AccountLoansSection({ accountId }: { accountId: string }) {
  const { data: loans, isLoading, error } = useLoans({ accountId });

  if (isLoading) return <div dir="rtl">در حال بارگذاری وام‌ها...</div>;
  if (error) return <div dir="rtl">خطا در بارگذاری وام‌ها</div>;
  if (!loans || loans.data.length === 0)
    return (
      <EmptyStateCard
        title="وامی برای این حساب ثبت نشده است"
        description="در حال حاضر هیچ وامی برای این حساب ثبت نشده است."
        dir="rtl"
      />
    );

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center gap-2">
        <div className="h-1 w-1 rounded-full bg-primary" />
        <h3 className="font-bold text-base">وام‌های این حساب</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loans.data.map((loan: Loan) => (
          <LoanCard key={loan.id} loan={loan} />
        ))}
      </div>
    </div>
  );
}
