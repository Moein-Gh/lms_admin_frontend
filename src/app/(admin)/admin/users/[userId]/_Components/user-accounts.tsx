"use client";

import NoAccountCard from "@/components/entity-specific/account/no-account-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccounts } from "@/hooks/use-account";
import { AccountCardsDesign } from "./account-designs/account-card";

type UserAccountsProps = {
  userId: string;
};

const UserAccounts = ({ userId }: UserAccountsProps) => {
  const { data, isLoading } = useAccounts({ userId });

  const accounts = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  if (accounts.length === 0) {
    return <NoAccountCard />;
  }

  return <AccountCardsDesign accounts={accounts} />;
};

export default UserAccounts;
