"use client";
import { useParams } from "next/navigation";

import FinancialCard from "@/components/financial/financial-card";
import { useUser } from "@/hooks/use-user";

import UserCard from "./_Components/user-card";

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
    <div className="flex flex-col gap-3 w-full lg:flex-row">
      <div className="w-full lg:w-5/12">
        <UserCard user={user} />
      </div>
      <div className="w-full flex flex-col gap-3 md:flex-row lg:w-7/12 ">
        <div className="w-full md:w-1/2">
          <FinancialCard />
        </div>
        <div className="w-full md:w-1/2">
          <FinancialCard />
        </div>
      </div>
    </div>
  );
}
