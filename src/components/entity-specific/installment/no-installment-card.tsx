import React from "react";
import { EmptyStateCard } from "@/components/empty-state-card";
import { CalendarCheckIcon } from "@/components/icons";

const NoInstallmentCard = () => {
  return (
    <EmptyStateCard
      title="قسطی یافت نشد"
      description="برای این وام هیچ قسط فعالی وجود ندارد."
      icon={<CalendarCheckIcon className="size-10 text-muted-foreground" />}
    />
  );
};

export default NoInstallmentCard;
