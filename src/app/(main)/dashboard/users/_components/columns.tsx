"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { User } from "@/types/entities/user.type";

export const columns: ColumnDef<User>[] = [
  {
    id: "rowNumber",
    meta: { className: "w-1/12" },
    header: "#",
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return <div className="text-center w-full text-muted-foreground">{pageIndex * pageSize + row.index + 1}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "identity.name",
    id: "name",
    meta: { className: "w-1/24 " },
    header: ({ column }) => <DataTableColumnHeader column={column} title="کاربر" />,
    enableSorting: false,
    cell: ({ row }) => {
      const name = row.original.identity.name ?? "نام نامشخص";
      return (
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{name}</p>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: "code",
    meta: { className: "w-1/12" },
    header: ({ column }) => <DataTableColumnHeader className="justify-center" column={column} title="کد" />,
    cell: ({ row }) => (
      <div className="text-center w-full ">
        <FormattedNumber type="normal" value={row.original.code} className="truncate font-medium" />
      </div>
    )
  },
  {
    id: "roles",

    meta: { className: "w-1/12" },
    header: "نقش ها",
    cell: ({ row }) => (
      <div className="flex flex-row gap-1 items-center justify-center">
        {row.original.roleAssignments?.map((roleAssignment) => (
          <Badge key={roleAssignment.id} variant="secondary" className="text-xs font-medium text-center">
            {roleAssignment.role?.name}
          </Badge>
        ))}
      </div>
    )
  },
  {
    accessorKey: "isActive",

    meta: { className: "w-1/12" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="وضعیت" />,
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant={row.original.isActive ? "active" : "inactive"}>
          {row.original.isActive ? "فعال" : "غیرفعال"}
        </Badge>
      </div>
    )
  },
  {
    accessorKey: "identity.createdAt",
    id: "createdAt", // Send "createdAt" to API instead of "identity.createdAt"

    meta: { className: "w-1/12" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="تاریخ عضویت" />,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.identity.createdAt
          ? new Date(row.original.identity.createdAt).toLocaleDateString("fa-IR")
          : "تاریخ نامشخص"}
      </div>
    )
  },
  {
    id: "actions",

    meta: { className: "w-1/12" },
    header: "عملیات",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/dashboard/users/${row.original.id}`}>
                <Eye />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>مشاهده جزئیات کاربر</TooltipContent>
        </Tooltip>
      </div>
    )
  }
];
