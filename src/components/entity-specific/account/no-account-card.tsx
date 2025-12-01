import React from "react";
import { IdCard } from "lucide-react";
import { EmptyStateCard } from "@/components/empty-state-card";

const NoAccountCard = () => {
  return (
    <EmptyStateCard
      title="حسابی یافت نشد"
      description="برای این کاربر هنوز هیچ حسابی تعریف نشده است."
      icon={<IdCard className="size-10 text-muted-foreground" />}
    />
  );
};

export default NoAccountCard;
