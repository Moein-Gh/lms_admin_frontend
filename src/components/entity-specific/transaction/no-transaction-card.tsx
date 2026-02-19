import { EmptyStateCard } from "@/components/empty-state-card";
import { TransactionIcon } from "@/components/icons";

const NoTransactionCard = () => {
  return (
    <EmptyStateCard
      title="تراکنشی یافت نشد"
      description="برای این کاربر هنوز هیچ تراکنشی تعریف نشده است."
      icon={<TransactionIcon className="size-10 text-muted-foreground" />}
    />
  );
};

export default NoTransactionCard;
