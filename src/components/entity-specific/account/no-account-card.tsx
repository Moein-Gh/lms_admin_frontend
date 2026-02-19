import React from "react";
import { EmptyStateCard } from "@/components/empty-state-card";
import { CardIcon } from "@/components/icons";

type NoAccountCardProps = {
  readonly title?: string;
  readonly description?: string;
};

const NoAccountCard = ({
  title = "حسابی یافت نشد",
  description = "برای این کاربر هنوز هیچ حسابی تعریف نشده است."
}: NoAccountCardProps) => {
  return (
    <EmptyStateCard
      title={title}
      description={description}
      icon={<CardIcon className="size-10 text-muted-foreground" />}
    />
  );
};

export default NoAccountCard;
