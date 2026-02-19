import React from "react";
import { EmptyStateCard } from "@/components/empty-state-card";
import { CalendarIcon } from "@/components/icons";

const NoSubscriptionFeeCard = () => {
  return (
    <EmptyStateCard
      title="ماهیانه ای یافت نشد"
      description="برای این کاربر هنوز هیچ ماهیانه ای تعریف نشده است."
      icon={<CalendarIcon className="size-10 text-muted-foreground" />}
    />
  );
};

export default NoSubscriptionFeeCard;
