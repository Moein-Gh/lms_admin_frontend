"use client";
import { useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAccount } from "@/hooks/admin/use-account";
import { AccountInfoCard } from "../_components/account-info-card";
import { AccountLoansSection } from "../_components/account-loans-section";
import { AccountSubscriptionFeesSection } from "../_components/account-subscription-fees-section";
import AccountTransactions from "../_components/account-transactions";

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

      <Tabs defaultValue="loans" className="space-y-4">
        <TabsList className="mx-auto">
          <TabsTrigger value="loans">وام‌ ها</TabsTrigger>
          <TabsTrigger value="subscriptionFees">ماهیانه ها</TabsTrigger>
          <TabsTrigger value="transactions">تراکنش‌ها</TabsTrigger>
        </TabsList>

        <TabsContent value="loans">
          <AccountLoansSection accountId={account.id} />
        </TabsContent>

        <TabsContent value="subscriptionFees">
          <AccountSubscriptionFeesSection accountId={account.id} />
        </TabsContent>

        <TabsContent value="transactions">
          <AccountTransactions accountId={account.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
