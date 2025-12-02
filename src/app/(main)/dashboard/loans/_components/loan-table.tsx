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
import { Loan } from "@/types/entities/loan.type";

function LoanStatusCell({ status }: { status: Loan["status"] }) {
  let variant: "active" | "outline" | "inactive" = "inactive";
  let label = "بسته شده";
  if (status === "ACTIVE") {
    variant = "active";
    label = "فعال";
  } else if (status === "PENDING") {
    variant = "outline";
    label = "در انتظار";
  }
  return <Badge variant={variant}>{label}</Badge>;
}

function LoanTableRow({
  loan,
  index,
  pagination
}: {
  loan: Loan;
  index: number;
  pagination: { page: number; pageSize: number };
}) {
  return (
    <TableRow key={loan.id}>
      <TableCell className="text-center  text-muted-foreground">
        <FormattedNumber type="normal" value={(pagination.page - 1) * pagination.pageSize + index + 1} />
      </TableCell>
      <TableCell className="font-medium">{loan.name}</TableCell>
      <TableCell>
        <Badge variant="secondary" className="">
          <FormattedNumber type="normal" value={loan.code} />
        </Badge>
      </TableCell>
      <TableCell>{loan.loanType ? <Badge variant="outline">{loan.loanType.name}</Badge> : "-"}</TableCell>
      <TableCell>{loan.account?.name ?? "-"}</TableCell>
      <TableCell>{loan.account?.user?.identity.name ?? "-"}</TableCell>
      <TableCell>
        <LoanStatusCell status={loan.status} />
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        <FormattedDate value={loan.createdAt} />
      </TableCell>
      <TableCell>
        <FormattedNumber type="price" value={Number(loan.amount)} />
      </TableCell>
      <TableCell className="text-center">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/loans/${loan.id}`}>
            <Eye />
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}

type Props = {
  readonly data?: { data: Loan[] };
  readonly isLoading: boolean;
  readonly error?: unknown;
  readonly pagination: { page: number; pageSize: number };
};

export function LoansTable({ data, isLoading, error, pagination }: Props) {
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
            <p className="text-muted-foreground">هیچ وامی یافت نشد</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full overflow-auto rounded-xl  bg-card py-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">#</TableHead>
            <TableHead>نام وام</TableHead>
            <TableHead>کد</TableHead>
            <TableHead>نوع وام</TableHead>
            <TableHead>نام حساب</TableHead>
            <TableHead>نام کاربر</TableHead>
            <TableHead>وضعیت</TableHead>
            <TableHead>تاریخ افتتاح</TableHead>
            <TableHead>مبلغ</TableHead>
            <TableHead className="text-center">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((loan: Loan, index: number) => (
            <LoanTableRow key={loan.id} loan={loan} index={index} pagination={pagination} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
