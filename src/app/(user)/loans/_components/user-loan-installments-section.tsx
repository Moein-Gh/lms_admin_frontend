"use client";

import { useInstallments } from "@/hooks/admin/use-installment";
import { OrderDirection } from "@/types/api";
import { Installment } from "@/types/entities/installment.type";
import { UserInstallmentCard } from "./user-installment-card";

export function UserLoanInstallmentsSection({ loanId }: { loanId: string }) {
  const {
    data: installments,
    isLoading,
    error
  } = useInstallments({
    loanId,
    orderBy: "dueDate",
    orderDir: OrderDirection.ASC
  });

  if (isLoading) return <div className="text-center text-muted-foreground">در حال بارگذاری اقساط...</div>;
  if (error) return <div className="text-center text-destructive">خطا در بارگذاری اقساط</div>;
  if (!installments || installments.data.length === 0)
    return <div className="text-center text-muted-foreground">اقساطی برای این وام ثبت نشده است</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <div className="h-1 w-1 rounded-full bg-primary" />
        <h3 className="font-bold text-base">اقساط این وام</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {installments.data.map((installment: Installment) => (
          <UserInstallmentCard key={installment.id} installment={installment} />
        ))}
      </div>
    </div>
  );
}
