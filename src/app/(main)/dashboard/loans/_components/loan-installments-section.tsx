import { useInstallments } from "@/hooks/use-installment";
import { OrderDirection } from "@/types/api";
import { Installment } from "@/types/entities/installment.type";
import { InstallmentCard } from "./installment-card";

export function LoanInstallmentsSection({ loanId }: { loanId: string }) {
  const {
    data: installments,
    isLoading,
    error
  } = useInstallments({
    loanId,
    orderBy: "dueDate",
    orderDir: OrderDirection.ASC
  });

  if (isLoading) return <div>در حال بارگذاری اقساط...</div>;
  if (error) return <div>خطا در بارگذاری اقساط</div>;
  if (!installments || installments.data.length === 0) return <div>اقساطی برای این وام ثبت نشده است</div>;
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <div className="h-1 w-1 rounded-full bg-primary" />
        <h3 className="font-bold text-base">اقساط این وام</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {installments.data.map((installment: Installment) => (
          <InstallmentCard key={installment.id} installment={installment} />
        ))}
      </div>
    </div>
  );
}
