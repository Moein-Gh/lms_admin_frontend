"use client";
import { useParams } from "next/navigation";
import { CreditCard, FileText, HandCoins, Receipt, Tag } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/use-user";

import { AccountCharts } from "./_Components/account-charts";
import LoanCharts from "./_Components/loan-charts";
import UserAccounts from "./_Components/user-accounts";
import UserInfoCard from "./_Components/user-info-card";
import UserLoanRequests from "./_Components/user-loan-requests";
import UserLoans from "./_Components/user-loans";
import UserSubscriptions from "./_Components/user-subscriptions";
import UserTransactions from "./_Components/user-transactions";

const tabs = [
  {
    name: "حساب ها",
    value: "accounts",
    icon: CreditCard
  },
  {
    name: "وام ها",
    value: "loans",
    icon: HandCoins
  },
  {
    name: "درخواست وام",
    value: "loan-requests",
    icon: FileText
  },
  {
    name: "تراکنش ها",
    value: "transactions",
    icon: Receipt
  },
  {
    name: "ماهیانه‌ها",
    value: "subscriptions",
    icon: Tag
  }
];

export default function UserPage() {
  const { userId } = useParams();
  const { data: user, isLoading, error } = useUser(userId as string);

  if (isLoading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div>خطا در بارگذاری داده‌های کاربر</div>;
  }

  if (!user) {
    return <div>کاربر یافت نشد</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-5/12">
          <UserInfoCard user={user} />
        </div>
        <div className="flex w-full flex-col gap-4 md:flex-row lg:w-7/12">
          <div className="w-full md:w-1/2">
            <AccountCharts userId={user.id} summary={user.balanceSummary?.accounts ?? []} />
          </div>
          <div className="w-full md:w-1/2">
            <LoanCharts userId={user.id} balance={user.balanceSummary?.loans} />
          </div>
        </div>
      </div>
      <div className="w-full">
        <Tabs defaultValue={tabs[0].value} className="w-full">
          <div className="w-full overflow-x-auto lg:max-w-xl lg:mx-auto">
            <TabsList className="px-2 py-4 w-full flex gap-2 sm:gap-4 justify-center bg-card rounded-xl min-h-12 min-w-max lg:min-w-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="p-2 rounded-xl text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-h-8"
                >
                  <span className="flex items-center gap-1 text-sm sm:text-[15px]">
                    <tab.icon className="me-1 hidden sm:inline h-5 w-5" />
                    {tab.name}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <TabsContent value="accounts" className="w-full">
            <div className="flex flex-col gap-2 w-full">
              <UserAccounts userId={userId as string} />
            </div>
          </TabsContent>
          <TabsContent value="loans" className="w-full">
            <div className="flex flex-col gap-2 w-full">
              <UserLoans userId={userId as string} />
            </div>
          </TabsContent>

          <TabsContent value="loan-requests" className="w-full">
            <div className="flex flex-col gap-2 w-full">
              <UserLoanRequests userId={userId as string} />
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="w-full">
            <div className="flex flex-col gap-2 w-full">
              <UserTransactions userId={userId as string} />
            </div>
          </TabsContent>

          <TabsContent value="subscriptions" className="w-full">
            <div className="flex flex-col gap-2 w-full">
              <UserSubscriptions userId={userId as string} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
