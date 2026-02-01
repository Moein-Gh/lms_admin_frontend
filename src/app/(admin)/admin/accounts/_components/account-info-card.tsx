"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  Calendar,
  CreditCard,
  Hash,
  Tag,
  User,
  Wallet,
  MoreVertical,
  BanknoteArrowDown,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useActivateAccount } from "@/hooks/use-account";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatPersianDate, DATE_FORMATS } from "@/lib/date-service";
import { AccountStatus, AccountStatusLabels, type Account } from "@/types/entities/account.type";
import BuyoutPanel from "./buyout-panel";
import TransferPanel from "./transfer/transfer-panel";

export function AccountInfoCard({ account }: { account: Account }) {
  const statusInfo = AccountStatusLabels[account.status];

  // Buyout panel open state; panel behavior is handled by `BuyoutPanel`
  const [buyOutOpen, setBuyOutOpen] = React.useState(false);
  const [transferOpen, setTransferOpen] = React.useState(false);

  const isMobile = useIsMobile();
  const { mutate: activate, isPending: isActivating } = useActivateAccount();

  const handleActivate = () => {
    activate(account.id, {
      onSuccess: () => {
        toast.success("حساب با موفقیت فعال شد");
      },
      onError: () => {
        toast.error("خطا در فعال‌سازی حساب");
      }
    });
  };

  return (
    <>
      <Card className="overflow-hidden border-none shadow-md bg-card py-0">
        <div className="flex flex-col md:flex-row">
          {/* Right Side: Account Details */}
          <div className="flex-1 p-6 space-y-8 flex flex-col md:justify-center">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">{account.name}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {account.user ? (
                    <Link
                      href={`/admin/users/${account.user.id}`}
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
                  <div className="flex items-center gap-1.5  text-xs">
                    <Hash className="h-3 w-3" />
                    <span>{account.code}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {account.status !== AccountStatus.INACTIVE ? (
                  <div className="flex flex-row gap-3">
                    {!isMobile ? (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              type="button"
                              onClick={() => setBuyOutOpen(true)}
                              aria-label="تسویه حساب"
                            >
                              تسویه
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>تسویه حساب</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              type="button"
                              onClick={() => setTransferOpen(true)}
                              aria-label="انتقال وجه"
                            >
                              انتقال وجه
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>انتقال وجه به حساب دیگر</TooltipContent>
                        </Tooltip>
                      </>
                    ) : (
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" aria-label="منو اقدامات">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-30 text-start " align="start">
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              className="flex h-10 justify-between items-center text-start"
                              onSelect={() => setTransferOpen(true)}
                            >
                              <Wallet className="h-4 w-4" />
                              <span>انتقال وجه</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex h-10 justify-between items-center bg-destructive/50 text-start"
                              onSelect={() => setBuyOutOpen(true)}
                            >
                              <BanknoteArrowDown className="h-4 w-4 text-foreground" />
                              <span>تسویه</span>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleActivate}
                    disabled={isActivating}
                    className="gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>فعال‌سازی حساب</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Info Grid (2x2): Card number, Bank, Created At, Account Type */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-8 justify-items-center">
              <div className="space-y-3 flex flex-col items-center">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>۸ رقم آخر شماره کارت</span>
                </div>
                <p className="text-base font-medium text-foreground text-center">
                  <FormattedNumber
                    type="normal"
                    value={`${account.cardNumber.slice(4, 8)} - ${account.cardNumber.slice(0, 4)}`}
                  />
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>بانک</span>
                </div>
                <p className="text-base font-medium text-foreground">{account.bankName}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>تاریخ افتتاح</span>
                </div>
                <p className="text-base font-medium text-foreground">
                  {formatPersianDate(account.createdAt, DATE_FORMATS.SHORT)}
                </p>
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

          {/* Left Side: Balance */}
          <div className="md:w-64 bg-linear-to-bl from-primary/5 via-muted/10 to-transparent border-t md:border-t-0 md:border-r flex flex-row md:flex-col justify-between items-center md:items-stretch p-4 md:p-6 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-1 h-full bg-linear-to-bl from-primary/50 via-primary/15 to-transparent" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

            {/* Amount display */}
            <div className="relative z-10">
              <div className="hidden md:flex items-center justify-start gap-1.5 text-xs text-muted-foreground mb-2">
                <Wallet className="h-3.5 w-3.5" />
                <span>موجودی کل</span>
              </div>
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                <FormattedNumber type="price" value={account.balanceSummary?.totalDeposits ?? 0} />
              </span>
            </div>

            {/* Status section */}
            <div className="md:pt-4 md:border-t border-border/30 flex items-center justify-between relative z-10">
              <span className="hidden md:inline text-xs text-muted-foreground">وضعیت</span>
              <Badge variant={statusInfo.badgeVariant}>{statusInfo.label}</Badge>
            </div>
          </div>
        </div>
      </Card>

      <BuyoutPanel open={buyOutOpen} onOpenChange={setBuyOutOpen} accountId={account.id} />
      <TransferPanel
        open={transferOpen}
        onOpenChange={setTransferOpen}
        sourceAccountId={account.id}
        userId={account.user?.id}
      />
    </>
  );
}
