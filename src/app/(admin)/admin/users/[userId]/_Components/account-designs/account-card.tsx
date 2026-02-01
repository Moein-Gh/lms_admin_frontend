"use client";

import Link from "next/link";
import { ArrowLeftIcon, Building2, CreditCard } from "lucide-react";

import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Account, AccountStatus, AccountStatusLabels } from "@/types/entities/account.type";

type AccountCardsDesignProps = {
  accounts: Account[];
};

const getStatusConfig = (status: AccountStatus) => {
  return AccountStatusLabels[status];
};

function AccountCard({ account }: { account: Account }) {
  const statusConfig = getStatusConfig(account.status);

  return (
    <div className="card-container flex flex-col">
      {/* Header: Icon + Type + Status + Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/5">
            <CreditCard className="size-5 text-primary" />
          </div>
          <Badge variant="outline" className="text-[10px] font-medium">
            {account.accountType?.name ?? "نوع نامشخص"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusConfig.badgeVariant} className="gap-1.5 border-0 text-[10px] font-medium">
            {statusConfig.label}
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline" className="size-9 md:size-10">
                <Link href={`/admin/accounts/${account.id}`}>
                  <ArrowLeftIcon className="size-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">مشاهده</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Account Name with Total Deposits before it */}
      <div className="mt-3 flex justify-between items-center gap-3">
        <h3 className="text-base font-semibold leading-tight truncate">{account.name}</h3>
        <span className="text-lg font-bold tabular-nums shrink-0">
          <FormattedNumber type="price" value={Number(account.balanceSummary?.totalDeposits) || 0} />
        </span>
      </div>

      <Separator className="my-3" />

      {/* Card Number & Bank */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">شماره کارت</span>
          <span className=" text-sm tracking-wide" dir="ltr">
            {account.cardNumber ? `•••• ${account.cardNumber.slice(-4)}` : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">بانک</span>
          <div className="flex items-center gap-1.5">
            <Building2 className="size-3.5 text-muted-foreground" />
            <span className="text-sm">{account.bankName || "نامشخص"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Account Cards Design
 */
export function AccountCardsDesign({ accounts }: AccountCardsDesignProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {accounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
}
