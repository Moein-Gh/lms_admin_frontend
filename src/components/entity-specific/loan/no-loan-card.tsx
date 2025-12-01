import { HandCoins } from "lucide-react";
import { EmptyStateCard } from "@/components/empty-state-card";

const NoLoanCard = () => {
  return (
    <EmptyStateCard
      title="وامی یافت نشد"
      description="برای این کاربر هنوز هیچ وامی تعریف نشده است."
      icon={<HandCoins className="size-10 text-muted-foreground" />}
    />
  );
};

export default NoLoanCard;
