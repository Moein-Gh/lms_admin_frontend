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
import { Transaction, TransactionKind } from "@/types/entities/transaction.type";

function getTransactionStatusLabel(status: Transaction["status"]) {
  switch (status) {
    case "APPROVED":
      return { label: "تایید شده", variant: "active" as const };
    case "PENDING":
      return { label: "در انتظار", variant: "outline" as const };
    case "REJECTED":
      return { label: "رد شده", variant: "inactive" as const };
    case "ALLOCATED":
      return { label: "تخصیص یافته", variant: "active" as const };
    default:
      return { label: "نامشخص", variant: "outline" as const };
  }
}

function getTransactionKindLabel(kind: TransactionKind) {
  switch (kind) {
    case TransactionKind.DEPOSIT:
      return { label: "واریز", variant: "active" as const };
    case TransactionKind.WITHDRAWAL:
      return { label: "برداشت", variant: "inactive" as const };
    case TransactionKind.LOAN_DISBURSEMENT:
      return { label: "پرداخت وام", variant: "inactive" as const };
    case TransactionKind.TRANSFER:
      return { label: "انتقال", variant: "secondary" as const };
    default:
      return { label: "نامشخص", variant: "outline" as const };
  }
}

export const columns: ColumnDef<Transaction>[] = [
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
    accessorKey: "code",
    id: "code",
    meta: { className: "w-[calc(100%/12)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="کد" />,
    cell: ({ row }) => <div className="font-medium">{row.original.code}</div>
  },
  {
    accessorKey: "kind",
    id: "kind",
    meta: { className: "w-[calc(100%/12)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="نوع تراکنش" />,
    cell: ({ row }) => {
      const kindLabel = getTransactionKindLabel(row.original.kind);
      return <Badge variant={kindLabel.variant}>{kindLabel.label}</Badge>;
    }
  },
  {
    accessorKey: "user.identity.name",
    id: "userName",
    meta: { className: "w-[calc(100%/12)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="نام کاربر" />,
    cell: ({ row }) => <div>{row.original.user?.identity.name ?? "—"}</div>
  },
  {
    accessorKey: "status",
    id: "status",
    meta: { className: "w-[calc(100%/12)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="وضعیت" />,
    cell: ({ row }) => {
      const statusLabel = getTransactionStatusLabel(row.original.status);
      return <Badge variant={statusLabel.variant}>{statusLabel.label}</Badge>;
    }
  },
  {
    accessorKey: "createdAt",
    id: "createdAt",
    meta: { className: "w-[calc(100%/12)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="تاریخ ایجاد" />,
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
              <Link href={`/admin/transactions/${row.original.id}`}>
                <Eye />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>مشاهده جزئیات تراکنش</TooltipContent>
        </Tooltip>
      </div>
    )
  }
];
