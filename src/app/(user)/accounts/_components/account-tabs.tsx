"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Receipt, HandCoins } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Account } from "@/types/entities/account.type";
import { LoanRequestsList } from "./loan-requests-list";
import { LoansList } from "./loans-list";

interface AccountTabsProps {
  account: Account;
}

export function AccountTabs({ account }: AccountTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab") ?? "loans";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="loans" className="gap-2">
          <Receipt className="size-4" />
          <span>وام‌ها</span>
        </TabsTrigger>
        <TabsTrigger value="loan-requests" className="gap-2">
          <HandCoins className="size-4" />
          <span>درخواست‌های وام</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="loans" className="mt-6">
        <LoansList accountId={account.id} />
      </TabsContent>
      <TabsContent value="loan-requests" className="mt-6">
        <LoanRequestsList accountId={account.id} />
      </TabsContent>
    </Tabs>
  );
}
