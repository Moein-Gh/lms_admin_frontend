"use client";

import Link from "next/link";

import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function formatCardNumber(cardNumber?: string) {
  if (!cardNumber) return "-";
  return cardNumber.replace(/(\d{4})(?=\d)/g, "$1-");
}
import { formatDate } from "@/lib/utils";
import { PaginatedResponseDto } from "@/types/api";
import { Account, AccountStatusLabels } from "@/types/entities/account.type";

type Props = {
  data: PaginatedResponseDto<Account> | null;
  isLoading: boolean;
  error: unknown;
  pagination: {
    page: number;
    pageSize: number;
  };
};

export function AccountsTable({ data, isLoading, error, pagination }: Props) {
  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="p-8 text-center">
            <p className="text-destructive">خطا در بارگذاری حساب‌ها</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="p-8 text-center">
            <p className="text-muted-foreground">هیچ حسابی یافت نشد</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full overflow-auto rounded-xl bg-card py-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">#</TableHead>
            <TableHead>نام حساب</TableHead>
            <TableHead>کد</TableHead>
            <TableHead>نوع حساب</TableHead>
            <TableHead>بانک</TableHead>
            <TableHead>دارنده حساب</TableHead>
            <TableHead>شماره کارت</TableHead>
            <TableHead>وضعیت</TableHead>
            <TableHead>تاریخ افتتاح حساب</TableHead>
            <TableHead className="text-center">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((account: Account, index: number) => (
            <TableRow key={account.id}>
              <TableCell className="text-center font-mono text-muted-foreground">
                {(pagination.page - 1) * pagination.pageSize + index + 1}
              </TableCell>
              <TableCell className="font-medium">{account.name}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-mono">
                  {account.code}
                </Badge>
              </TableCell>
              <TableCell>
                {account.accountType ? <Badge variant="outline">{account.accountType.name}</Badge> : "-"}
              </TableCell>
              <TableCell>{account.bankName || "-"}</TableCell>
              <TableCell>
                {account.user?.id && account.user.identity.name ? (
                  <Link
                    href={`/dashboard/users/${account.user.id}`}
                    className="text-primary font-bold hover:text-primary/80 transition-colors"
                    style={{ textDecoration: "none" }}
                  >
                    {account.user.identity.name}
                  </Link>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <span className="font-mono text-sm">{formatCardNumber(account.cardNumber)}</span>
              </TableCell>
              <TableCell>
                <Badge variant={AccountStatusLabels[account.status].badgeVariant}>
                  {AccountStatusLabels[account.status].label}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{formatDate(account.createdAt)}</TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/accounts/${account.id}`}>
                          <Eye />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>مشاهده جزئیات حساب</TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
