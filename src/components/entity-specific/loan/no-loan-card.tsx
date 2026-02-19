import { EmptyStateCard } from "@/components/empty-state-card";
import { LoanIcon } from "@/components/icons";

const NoLoanCard = () => {
  return (
    <EmptyStateCard
      title="وامی یافت نشد"
      description="برای این کاربر هنوز هیچ وامی تعریف نشده است."
      icon={<LoanIcon className="size-10 text-muted-foreground" />}
    />
  );
};

export default NoLoanCard;
