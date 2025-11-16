import { useSubscriptionFees } from "@/hooks/use-subscription-fee";
import { SubscriptionFeeCard } from "./subscription-fee-card";

export function AccountSubscriptionFeesSection({ accountId }: { accountId: string }) {
  const { data: fees, isLoading, error } = useSubscriptionFees({ accountId, pageSize: 12 });

  if (isLoading) return <div>در حال بارگذاری مبلغ اشتراک...</div>;
  if (error) return <div>خطا در بارگذاری مبلغ اشتراک</div>;
  if (!fees || fees.data.length === 0) return <div>هزینه اشتراکی برای این حساب ثبت نشده است</div>;

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center gap-2">
        <div className="h-1 w-1 rounded-full bg-primary" />
        <h3 className="font-bold text-base">هزینه‌های اشتراک این حساب</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fees.data.map((fee) => (
          <SubscriptionFeeCard key={fee.id} fee={fee} />
        ))}
      </div>
    </div>
  );
}
