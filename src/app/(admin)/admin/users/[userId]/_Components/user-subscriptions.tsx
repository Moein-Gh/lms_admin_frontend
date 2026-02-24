"use client";

import NoSubscriptionFeeCard from "@/components/entity-specific/subscription-fee/no-subscription-fee-card";
import { Plus } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useCreateNextSubscriptionFees, useSubscriptionFees } from "@/hooks/admin/use-subscription-fee";
import { OrderDirection } from "@/types/api";
import { SubscriptionFeeStatus } from "@/types/entities/subscription-fee.type";
import { SubscriptionFeeCard } from "../../../accounts/_components/subscription-fee-card";

type Props = {
  userId: string;
};

function AccountFeeGroup({ accountId, fees }: { accountId: string; fees: { id: string; [key: string]: unknown }[] }) {
  const { mutate: createNext, isPending } = useCreateNextSubscriptionFees(accountId);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {fees.map((fee) => (
          <SubscriptionFeeCard key={fee.id} fee={fee as never} />
        ))}
      </div>
    </div>
  );
}

export default function UserSubscriptions({ userId }: Props) {
  const {
    data: feesData,
    isLoading,
    error
  } = useSubscriptionFees({
    userId,
    pageSize: 100,
    orderDir: OrderDirection.ASC,
    status: SubscriptionFeeStatus.DUE
  });

  if (isLoading) return <div>در حال بارگذاری ماهیانه‌ها...</div>;
  if (error) return <div>خطا در بارگذاری ماهیانه‌ها</div>;

  const fees = feesData?.data ?? [];
  if (fees.length === 0) return <NoSubscriptionFeeCard />;

  const grouped = fees.reduce<Record<string, typeof fees>>((acc, fee) => {
    (acc[fee.accountId] ??= []).push(fee);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([accountId, accountFees]) => (
        <AccountFeeGroup key={accountId} accountId={accountId} fees={accountFees} />
      ))}
    </div>
  );
}
