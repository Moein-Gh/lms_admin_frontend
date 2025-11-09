import Link from "next/link";
import { Building2, Tag, CheckCircle2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Account } from "@/types/entities/account.type";

function formatCardNumber(cardNumber: string) {
  return cardNumber.match(/.{1,4}/g)?.join(" ") ?? cardNumber;
}

export function AccountInfoCard({ account }: { account: Account }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-3 sm:p-4 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold">{account.name}</h2>
          <p className="text-base text-muted-foreground font-mono">{formatCardNumber(account.cardNumber)}</p>
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
      <div className="px-3 sm:px-4 pt-1 pb-0 grid grid-cols-2 sm:grid-cols-4 gap-x-2 gap-y-2 sm:gap-x-3 sm:gap-y-2 justify-items-center">
        <div className="flex flex-col gap-0.5 items-center">
          <div className="flex items-center gap-1 text-base text-muted-foreground justify-center">
            <Building2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span>بانک</span>
          </div>
          <p className="font-medium text-xs sm:text-sm leading-tight text-center">{account.bankName}</p>
        </div>
        <div className="flex flex-col gap-0.5 items-center">
          <div className="flex items-center gap-1 text-base text-muted-foreground justify-center">
            <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span>نوع حساب</span>
          </div>
          <p className="font-medium text-xs sm:text-sm leading-tight text-center">{account.accountType?.name}</p>
        </div>
        <div className="flex flex-col gap-0.5 items-center">
          <div className="flex items-center gap-1 text-base text-muted-foreground justify-center">
            <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span>وضعیت</span>
          </div>
          <Badge
            variant={account.status === "active" ? "default" : "secondary"}
            className="w-fit text-base py-0 leading-tight mx-auto"
          >
            {account.status === "active" ? "فعال" : "غیرفعال"}
          </Badge>
        </div>
        <div className="flex flex-col gap-0.5 items-center">
          <div className="flex items-center gap-1 text-base text-muted-foreground justify-center">
            <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span>تاریخ ایجاد</span>
          </div>
          <p className="font-medium text-base leading-tight text-center">
            {new Date(account.createdAt).toLocaleDateString("fa-IR")}
          </p>
        </div>
      </div>
    </Card>
  );
}
