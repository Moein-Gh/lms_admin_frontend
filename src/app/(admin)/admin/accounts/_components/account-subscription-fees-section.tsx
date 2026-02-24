import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateNextSubscriptionFees, useSubscriptionFees } from "@/hooks/admin/use-subscription-fee";
import { OrderDirection } from "@/types/api";
import { SubscriptionFeeCard } from "./subscription-fee-card";

export function AccountSubscriptionFeesSection({ accountId }: { accountId: string }) {
  const {
    data: fees,
    isLoading,
    error
  } = useSubscriptionFees({ accountId, pageSize: 12, orderDir: OrderDirection.ASC });

  const { mutate: createNext, isPending } = useCreateNextSubscriptionFees(accountId);

  if (isLoading) return <div>در حال بارگذاری مبلغ اشتراک...</div>;
  if (error) return <div>خطا در بارگذاری مبلغ اشتراک</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-primary" />
          <h3 className="font-bold text-base">ماهیانه های این حساب</h3>
        </div>
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => createNext({ numberOfMonths: 1 })}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          ماهیانه بعدی
        </Button>
      </div>
      {!fees || fees.data.length === 0 ? (
        <div>ماهیانه ای برای این حساب ثبت نشده است</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fees.data.map((fee) => (
            <SubscriptionFeeCard key={fee.id} fee={fee} />
          ))}
        </div>
      )}
    </div>
  );
}
