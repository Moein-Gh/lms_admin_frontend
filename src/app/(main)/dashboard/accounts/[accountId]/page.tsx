"use client";
import { useParams } from "next/navigation";
import { useAccount } from "@/hooks/use-account";
import { AccountInfoCard } from "../_components/account-info-card";
import { AccountLoansSection } from "../_components/account-loans-section";

export default function AccountDetailPage() {
  const { accountId } = useParams();
  const { data: account, isLoading, error } = useAccount(accountId as string);

  if (isLoading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div>خطا در بارگذاری داده‌های کاربر</div>;
  }

  if (!account) {
    return <div>کاربر یافت نشد</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto py-4 sm:py-8 px-4 space-y-6 sm:space-y-8">
      <AccountInfoCard account={account} />
      <AccountLoansSection accountId={account.id} />
    </div>
  );
}
