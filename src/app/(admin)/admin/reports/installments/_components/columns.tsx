"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { type InstallmentWithRelations } from "@/types/entities/installment-projection.type";

export const columns: ColumnDef<InstallmentWithRelations>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => <DataTableColumnHeader column={column} title="کد" />,
    cell: ({ row }) => (
      <div className="font-medium">
        <FormattedNumber value={row.getValue("code")} type="normal" />
      </div>
    )
  },
  {
    accessorKey: "installmentNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="شماره قسط" />,
    cell: ({ row }) => <FormattedNumber value={row.getValue("installmentNumber")} type="normal" />
  },
  {
    id: "loan",
    accessorFn: (row) => row.loan.code,
    header: ({ column }) => <DataTableColumnHeader column={column} title="وام" />,
    cell: ({ row }) => (
      <Link href={`/admin/loans/${row.original.loan.id}`} className="font-medium text-primary hover:underline">
        <FormattedNumber value={row.original.loan.code} type="normal" />
      </Link>
    )
  },
  {
    id: "user",
    accessorFn: (row) => row.loan.user.identity.name,
    header: ({ column }) => <DataTableColumnHeader column={column} title="کاربر" />,
    cell: ({ row }) => (
      <Link href={`/admin/users/${row.original.loan.user.id}`} className="font-medium text-primary hover:underline">
        {row.original.loan.user.identity.name}
      </Link>
    )
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="مبلغ" />,
    cell: ({ row }) => <FormattedNumber value={row.getValue("amount")} type="price" />
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="تاریخ سررسید" />,
    cell: ({ row }) => <FormattedDate value={row.getValue("dueDate")} />
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="وضعیت" />,
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge variant={status === "PAID" ? "default" : "secondary"}>{status === "PAID" ? "پرداخت شده" : "فعال"}</Badge>
      );
    }
  },
  {
    id: "actions",
    header: ({ column }) => <DataTableColumnHeader column={column} title="عملیات" />,
    cell: ({ row }) => (
      <Link href={`/admin/loans/${row.original.loan.id}`} className="text-primary hover:underline">
        مشاهده وام
      </Link>
    )
  }
];
