"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction, TransactionKind } from "@/types/entities/transaction.type";

function TransactionStatusCell({ status }: { status: Transaction["status"] }) {
  let variant: "active" | "outline" | "inactive";
  let label: string;
  switch (status) {
    case "APPROVED":
      variant = "active";
      label = "تایید شده";
      break;
    case "PENDING":
      variant = "outline";
      label = "در انتظار";
      break;
    case "REJECTED":
      variant = "inactive";
      label = "رد شده";
      break;
    case "ALLOCATED":
      variant = "active";
      label = "تخصیص یافته";
      break;
    default:
      variant = "outline";
      label = "نامشخص";
  }
  return <Badge variant={variant}>{label}</Badge>;
}

function TransactionKindCell({ kind }: { kind: TransactionKind }) {
  let variant: "active" | "outline" | "inactive";
  let label: string;
  switch (kind) {
    case TransactionKind.DEPOSIT:
      variant = "active";
      label = "واریز";
      break;
    case TransactionKind.WITHDRAWAL:
      variant = "inactive";
      label = "برداشت";
      break;
    case TransactionKind.LOAN_DISBURSEMENT:
      variant = "inactive";
      label = "پرداخت وام";
      break;
    case TransactionKind.LOAN_REPAYMENT:
      variant = "active";
      label = "بازپرداخت وام";
      break;
    case TransactionKind.SUBSCRIPTION_PAYMENT:
      variant = "inactive";
      label = "پرداخت اشتراک";
      break;
    case TransactionKind.FEE:
      variant = "inactive";
      label = "کارمزد";
      break;
    default:
      variant = "outline";
      label = "نامشخص";
  }
  return <Badge variant={variant}>{label}</Badge>;
}
function TransactionTableRow({
  transaction,
  index,
  pagination
}: {
  transaction: Transaction;
  index: number;
  pagination: { page: number; pageSize: number };
}) {
  return (
    <TableRow key={transaction.id}>
      <TableCell className="text-center  text-muted-foreground">
        <FormattedNumber type="normal" value={(pagination.page - 1) * pagination.pageSize + index + 1} />
      </TableCell>
      <TableCell className="font-medium">{transaction.code}</TableCell>
      <TableCell>
        <TransactionKindCell kind={transaction.kind} />
      </TableCell>

      <TableCell>{transaction.user?.identity.name ?? "-"}</TableCell>
      <TableCell>
        <TransactionStatusCell status={transaction.status} />
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        <FormattedDate value={transaction.createdAt} />
      </TableCell>
      <TableCell>
        <FormattedNumber type="price" value={Number(transaction.amount)} />
      </TableCell>
      <TableCell className="text-center">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/transactions/${transaction.id}`}>
            <Eye />
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}

type Props = {
  readonly data?: { data: Transaction[] };
  readonly isLoading: boolean;
  readonly error?: unknown;
  readonly pagination: { page: number; pageSize: number };
};

export function TransactionsTable({ data, isLoading, error, pagination }: Props) {
  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="p-8 text-center">
            <p className="text-destructive">خطا در بارگذاری وام‌ها</p>
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
            <p className="text-muted-foreground">هیچ تراکنشی یافت نشد</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full max-h-[70vh] overflow-auto rounded-xl bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">#</TableHead>
            <TableHead>کد</TableHead>
            <TableHead>نوع وام</TableHead>
            <TableHead>نام کاربر</TableHead>
            <TableHead>وضعیت</TableHead>
            <TableHead>تاریخ افتتاح</TableHead>
            <TableHead>مبلغ</TableHead>
            <TableHead className="text-center">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((transaction: Transaction, index: number) => (
            <TransactionTableRow key={transaction.id} transaction={transaction} index={index} pagination={pagination} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
