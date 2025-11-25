"use client";
import { useParams } from "next/navigation";
import { CreditCard, HandCoins, Receipt } from "lucide-react";

import FinancialCard from "@/components/financial/financial-card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/use-user";

import UserAccounts from "./_Components/user-accounts";
import UserCard from "./_Components/user-card";
import UserLoans from "./_Components/user-loans";
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
    name: "تراکنش ها",
    value: "transactions",
    icon: Receipt
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
    <div className="flex flex-col gap-3">
      <div className="flex w-full flex-col gap-3 lg:flex-row">
        <div className="w-full lg:w-5/12">
          <UserCard user={user} />
        </div>
        <div className="flex w-full flex-col gap-3 md:flex-row lg:w-7/12">
          <div className="w-full md:w-1/2">
            <FinancialCard />
          </div>
          <div className="w-full md:w-1/2">
            <FinancialCard />
          </div>
        </div>
      </div>
      <Separator className="bg-accent-foreground" />
      <div className=" rounded-xl bg-muted p-4">
        <Tabs defaultValue={tabs[0].value} dir="rtl" className="flex w-full flex-col items-start gap-4 md:flex-row">
          <TabsList className="grid w-full shrink-0 grid-cols-3 gap-1 bg-transparent p-0 md:w-auto md:grid-cols-1">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="justify-center px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:justify-start"
              >
                <tab.icon className="me-2 size-4" />
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="w-full flex-1">
            <TabsContent value="accounts" className="mt-0">
              <UserAccounts userId={userId as string} />
            </TabsContent>
            <TabsContent value="loans" className="mt-0">
              <UserLoans userId={userId as string} />
            </TabsContent>
            <TabsContent value="transactions" className="mt-0">
              <UserTransactions userId={userId as string} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
