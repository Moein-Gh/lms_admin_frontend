import { ArrowLeftRight } from "lucide-react";
import { EmptyStateCard } from "@/components/empty-state-card";

const NoTransactionCard = () => {
  return (
    <EmptyStateCard
      title="تراکنشی یافت نشد"
      description="برای این کاربر هنوز هیچ تراکنشی تعریف نشده است."
      icon={<ArrowLeftRight className="size-10 text-muted-foreground" />}
    />
  );
};

export default NoTransactionCard;
