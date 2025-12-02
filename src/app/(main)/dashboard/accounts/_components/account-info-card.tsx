"use client";

import Link from "next/link";
import { Building2, Calendar, Copy, CreditCard, Hash, Tag, User, Wallet } from "lucide-react";
import { toast } from "sonner";

import { FormattedNumber } from "@/components/formatted-number";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AccountStatus, type Account } from "@/types/entities/account.type";

function formatCardNumber(cardNumber: string) {
  return cardNumber.match(/.{1,4}/g)?.join(" ") ?? cardNumber;
}

export type AccountStatusLabel = {
  readonly label: string;
  readonly badgeVariant: BadgeVariant;
};

export const AccountStatusLabels: Record<AccountStatus, AccountStatusLabel> = {
  [AccountStatus.ACTIVE]: { label: "فعال", badgeVariant: "default" },
  [AccountStatus.INACTIVE]: { label: "غیرفعال", badgeVariant: "inactive" },
  [AccountStatus.RESTRICTED]: { label: "دارای وام فعال", badgeVariant: "destructive" }
};

export function AccountInfoCard({ account }: { account: Account }) {
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} کپی شد`);
  };

  const statusInfo = AccountStatusLabels[account.status];

  return (
    <Card className="overflow-hidden border-none shadow-md bg-card">
      <div className="flex flex-col md:flex-row">
        {/* Right Side: Account Details */}
        <div className="flex-1 p-6 space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{account.name}</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {account.user ? (
                  <Link
                    href={`/dashboard/users/${account.user.id}`}
                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>{account.user.identity.name}</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    <span>بدون کاربر</span>
                  </div>
                )}
                <span className="text-border">•</span>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <Hash className="h-3 w-3" />
                  <span>{account.code}</span>
                </div>
              </div>
            </div>
            <Badge variant={statusInfo.badgeVariant} className="px-3 py-1">
              {statusInfo.label}
            </Badge>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <CreditCard className="h-3.5 w-3.5" />
                <span>شماره کارت</span>
              </div>
              <div className="group flex items-center gap-3">
                <p className="font-mono text-base font-semibold tracking-widest text-foreground whitespace-nowrap">
                  {formatCardNumber(account.cardNumber)}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity -ml-2"
                  onClick={() => handleCopy(account.cardNumber, "شماره کارت")}
                >
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="sr-only">کپی شماره کارت</span>
                </Button>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>بانک</span>
                </div>
                <p className="text-base font-medium text-foreground">{account.bankName}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Tag className="h-3.5 w-3.5" />
                  <span>نوع حساب</span>
                </div>
                <p className="text-base font-medium text-foreground">{account.accountType?.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Left Side: Balance */}
        <div className="md:w-80 bg-muted/10 border-t md:border-t-0 md:border-r flex flex-col justify-between p-6 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-1 h-full bg-linear-to-b from-primary/40 to-transparent opacity-50" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Wallet className="h-4 w-4" />
              <span>موجودی کل</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tracking-tight text-foreground">
                <FormattedNumber type="price" value={account.balanceSummary?.totalDeposits ?? 0} />
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground relative z-10">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>تاریخ افتتاح</span>
            </div>
            <span className="font-medium font-mono">{new Date(account.createdAt).toLocaleDateString("fa-IR")}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
