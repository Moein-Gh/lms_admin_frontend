import React from "react";
import { Calendar } from "lucide-react";
import { EmptyStateCard } from "@/components/empty-state-card";

const NoSubscriptionFeeCard = () => {
  return (
    <EmptyStateCard
      title="ماهیانه ای یافت نشد"
      description="برای این کاربر هنوز هیچ ماهیانه ای تعریف نشده است."
      icon={<Calendar className="size-10 text-muted-foreground" />}
    />
  );
};

export default NoSubscriptionFeeCard;
