"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DATE_FORMATS } from "@/lib/date-service";
import { Loan } from "@/types/entities/loan.type";

function getLoanStatusLabel(status: Loan["status"]) {
  switch (status) {
    case "ACTIVE":
      return { label: "فعال", variant: "active" as const };
    case "PENDING":
      return { label: "در انتظار", variant: "outline" as const };
    default:
      return { label: "بسته شده", variant: "inactive" as const };
  }
}

export const columns: ColumnDef<Loan>[] = [
  {
    id: "rowNumber",
    meta: { className: "w-[calc(100%/12)]" },
    header: "#",
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return (
        <div className="text-center w-full text-muted-foreground">
          <FormattedNumber type="normal" value={pageIndex * pageSize + row.index + 1} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "name",
    id: "name",
    meta: { className: "w-[calc(100%/12)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="نام وام" />,
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>
  },
  {
    accessorKey: "code",
    id: "code",
    meta: { className: "w-[calc(100%/12)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="کد" />,
    cell: ({ row }) => (
      <Badge variant="secondary">
        <FormattedNumber type="normal" value={row.original.code} />
      </Badge>
    )
  },
  {
    accessorKey: "loanType.name",
    id: "loanType",
    meta: { className: "w-[calc(100%/12)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="نوع وام" />,
    cell: ({ row }) =>
      row.original.loanType ? <Badge variant="outline">{row.original.loanType.name}</Badge> : <span>—</span>
  },
  {
    accessorKey: "account.name",
    id: "accountName",
    meta: { className: "w-[calc(100%/12)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="نام حساب" />,
    cell: ({ row }) => <div>{row.original.account?.name ?? "—"}</div>
  },
  {
    accessorKey: "account.user.identity.name",
    id: "userName",
    meta: { className: "w-[calc(100%/12)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="نام کاربر" />,
    cell: ({ row }) => <div>{row.original.account?.user?.identity.name ?? "—"}</div>
  },
  {
    accessorKey: "status",
    id: "status",
    meta: { className: "w-[calc(100%/12)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="وضعیت" />,
    cell: ({ row }) => {
      const statusLabel = getLoanStatusLabel(row.original.status);
      return <Badge variant={statusLabel.variant}>{statusLabel.label}</Badge>;
    }
  },
  {
    accessorKey: "createdAt",
    id: "createdAt",
    meta: { className: "w-[calc(100%/12)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="تاریخ افتتاح" />,
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        <FormattedDate value={row.original.createdAt} format={DATE_FORMATS.SHORT} />
      </div>
    )
  },
  {
    accessorKey: "amount",
    id: "amount",
    meta: { className: "w-[calc(100%/12)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="مبلغ" />,
    cell: ({ row }) => <FormattedNumber type="price" value={Number(row.original.amount)} />
  },
  {
    id: "actions",
    meta: { className: "w-[calc(100%/12)]" },
    header: "عملیات",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/dashboard/loans/${row.original.id}`}>
                <Eye />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>مشاهده جزئیات وام</TooltipContent>
        </Tooltip>
      </div>
    )
  }
];
