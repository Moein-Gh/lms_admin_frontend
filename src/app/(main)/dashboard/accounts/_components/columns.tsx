"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";
import { Account, AccountStatusLabels } from "@/types/entities/account.type";

export const columns: ColumnDef<Account>[] = [
  {
    id: "rowNumber",
    meta: { className: "w-12" },
    header: "#",
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return <div className="text-center text-muted-foreground">{pageIndex * pageSize + row.index + 1}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "name",
    meta: { className: "w-3/12" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="نام حساب" />,
    cell: ({ row }) => <div className="font-medium truncate">{row.original.name}</div>
  },
  {
    accessorKey: "code",
    meta: { className: "w-2/12" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="کد" />,
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="secondary">{row.original.code}</Badge>
      </div>
    )
  },
  {
    accessorKey: "accountType.name",
    id: "accountType",
    meta: { className: "w-2/12" },
    header: "نوع حساب",
    cell: ({ row }) =>
      row.original.accountType ? <Badge variant="outline">{row.original.accountType.name}</Badge> : "-"
  },
  {
    accessorKey: "bankName",
    meta: { className: "w-2/12" },
    header: "بانک",
    cell: ({ row }) => row.original.bankName || "-"
  },
  {
    accessorKey: "user.identity.name",
    id: "owner",
    meta: { className: "w-3/12" },
    header: "دارنده حساب",
    cell: ({ row }) => {
      const user = row.original.user;
      if (user?.id && user.identity.name) {
        return (
          <Link href={`/dashboard/users/${user.id}`} className="text-primary font-bold hover:text-primary/80">
            {user.identity.name}
          </Link>
        );
      }
      return "-";
    }
  },
  {
    accessorKey: "cardNumber",
    meta: { className: "w-32" },
    header: "شماره کارت",
    cell: ({ row }) => {
      const card = row.original.cardNumber;
      if (!card) return "-";
      return <span className="text-sm">{card.replace(/(\d{4})(?=\d)/g, "$1-")} **** ****</span>;
    }
  },
  {
    accessorKey: "balanceSummary.totalDeposits",
    id: "balance",
    meta: { className: "w-36" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="موجودی" />,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-center font-medium text-primary">
        <FormattedNumber type="price" value={Number(row.original.balanceSummary?.totalDeposits) || 0} />
      </div>
    )
  },
  {
    accessorKey: "status",
    meta: { className: "w-24" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="وضعیت" />,
    cell: ({ row }) => {
      const status = row.original.status;
      const label = AccountStatusLabels[status].label;
      const variant = AccountStatusLabels[status].badgeVariant;
      return <Badge variant={variant}>{label}</Badge>;
    }
  },
  {
    accessorKey: "createdAt",
    id: "createdAt",
    meta: { className: "w-40" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="تاریخ افتتاح حساب" />,
    cell: ({ row }) => <div className="text-sm text-muted-foreground">{formatDate(row.original.createdAt)}</div>
  },
  {
    id: "actions",
    meta: { className: "w-16" },
    header: "عملیات",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/dashboard/accounts/${row.original.id}`}>
                <Eye />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>مشاهده جزئیات حساب</TooltipContent>
        </Tooltip>
      </div>
    )
  }
];
