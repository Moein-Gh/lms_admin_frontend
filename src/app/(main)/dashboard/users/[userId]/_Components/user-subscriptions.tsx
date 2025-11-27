"use client";

import { SubscriptionFeeCard } from "@/app/(main)/dashboard/accounts/_components/subscription-fee-card";
import { useSubscriptionFees } from "@/hooks/use-subscription-fee";
import { OrderDirection } from "@/types/api";
import { SubscriptionFeeStatus } from "@/types/entities/subscription-fee.type";

type Props = {
  userId: string;
};

export default function UserSubscriptions({ userId }: Props) {
  const {
    data: feesData,
    isLoading,
    error
  } = useSubscriptionFees({ userId, pageSize: 100, orderDir: OrderDirection.ASC, status: SubscriptionFeeStatus.DUE });

  if (isLoading) return <div>در حال بارگذاری ماهیانه‌ها...</div>;
  if (error) return <div>خطا در بارگذاری ماهیانه‌ها</div>;

  const fees = feesData?.data ?? [];
  if (fees.length === 0) return <div>هیچ هزینه اشتراکی برای این کاربر ثبت نشده است</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {fees.map((fee) => (
        <SubscriptionFeeCard key={fee.id} fee={fee} />
      ))}
    </div>
  );
}
