"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Building2, Tag, CheckCircle2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAccount } from "@/hooks/use-account";
import type { Account } from "@/types/entities/account.type";

function AccountInfoCard({ account }: { account: Account }) {
  // Format card number with spaces every 4 digits
  const formatCardNumber = (cardNumber: string) => {
    return cardNumber.match(/.{1,4}/g)?.join(" ") ?? cardNumber;
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-3 sm:p-4 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold">{account.name}</h2>
          <p className="text-base  text-muted-foreground font-mono">{formatCardNumber(account.cardNumber)}</p>
        </div>
        {account.user ? (
          <Link href={`/dashboard/users/${account.user.id}`}>
            <Badge variant="outline" className="hover:bg-accent">
              {account.user.identity.name}
            </Badge>
          </Link>
        ) : null}
      </div>

      <Separator />

      {/* Details Grid */}
      <div className="px-3 sm:px-4 pt-1 pb-0 grid grid-cols-2 sm:grid-cols-4 gap-x-2 gap-y-0.5 sm:gap-x-3 sm:gap-y-0">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 text-base text-muted-foreground">
            <Building2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span>بانک</span>
          </div>
          <p className="font-medium text-xs sm:text-sm leading-tight">{account.bankName}</p>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 text-base text-muted-foreground">
            <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span>نوع حساب</span>
          </div>
          <p className="font-medium text-xs sm:text-sm leading-tight">{account.accountType?.name}</p>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 text-base text-muted-foreground">
            <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span>وضعیت</span>
          </div>
          <Badge
            variant={account.status === "active" ? "default" : "secondary"}
            className="w-fit text-base py-0 leading-tight"
          >
            {account.status === "active" ? "فعال" : "غیرفعال"}
          </Badge>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 text-base text-muted-foreground">
            <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span>تاریخ ایجاد</span>
          </div>
          <p className="font-medium text-base leading-tight">
            {new Date(account.createdAt).toLocaleDateString("fa-IR")}
          </p>
        </div>
      </div>
    </Card>
  );
}

type Loan = {
  id: string;
  amount: number;
  status: string;
  dueDate: string;
};

function AccountLoansSection({ loans }: { loans: Loan[] }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <div className="h-1 w-1 rounded-full bg-primary" />
        <h3 className="font-bold text-base ">وام‌های این حساب</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {loans.map((loan) => (
          <Card
            key={loan.id}
            className="p-4 sm:p-5 hover:shadow-lg transition-shadow duration-200 border-r-4 border-r-primary/20"
          >
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-bold">{loan.amount.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">ریال</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${loan.status === "فعال" ? "bg-green-500" : "bg-gray-400"}`} />
                  <span className="text-sm font-medium">{loan.status}</span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {loan.dueDate}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

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

  // TODO: Replace with actual loans data fetching
  const mockLoans = [
    { id: "l1", amount: 5000000, status: "فعال", dueDate: "1404/01/01" },
    { id: "l2", amount: 2000000, status: "تسویه شده", dueDate: "1403/10/15" }
  ];

  return (
    <div className="container max-w-4xl mx-auto py-4 sm:py-8 px-4 space-y-6 sm:space-y-8">
      <AccountInfoCard account={account} />
      <AccountLoansSection loans={mockLoans} />
    </div>
  );
}
