"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Check, MoreVertical, Pencil, Trash, X } from "lucide-react";
import { toast } from "sonner";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useApproveLoanRequest, useDeleteLoanRequest, useRejectLoanRequest } from "@/hooks/admin/use-loan-request";
import { LoanRequest, LoanRequestStatus, LoanRequestStatusLabels } from "@/types/entities/loan-request.type";

import { EditLoanRequestNoteDialog } from "./edit-loan-request-note-dialog";

function getStatusVariant(status: LoanRequestStatus) {
  switch (status) {
    case LoanRequestStatus.APPROVED:
      return "default";
    case LoanRequestStatus.IN_QUEUE:
      return "secondary";
    case LoanRequestStatus.PENDING:
      return "outline";
    case LoanRequestStatus.REJECTED:
      return "destructive";
    case LoanRequestStatus.CONVERTED:
      return "active";
    default:
      return "outline";
  }
}

function ActionsCell({ loanRequest }: { loanRequest: LoanRequest }) {
  const { mutate: approve, isPending: isApproving } = useApproveLoanRequest();
  const { mutate: reject, isPending: isRejecting } = useRejectLoanRequest();
  const { mutate: deleteLoanRequest, isPending: isDeleting } = useDeleteLoanRequest();
  const [editNoteOpen, setEditNoteOpen] = React.useState(false);

  const canApprove = loanRequest.status === LoanRequestStatus.PENDING;
  const canReject = loanRequest.status === LoanRequestStatus.PENDING;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          {canApprove && (
            <DropdownMenuItem
              disabled={isApproving}
              onSelect={() =>
                approve(loanRequest.id, {
                  onSuccess: () => toast.success("درخواست وام تایید شد"),
                  onError: () => toast.error("خطا در تایید درخواست وام")
                })
              }
              className="flex justify-between items-center"
            >
              <span>تایید</span>
              <Check className="size-4" />
            </DropdownMenuItem>
          )}
          {canReject && (
            <DropdownMenuItem
              disabled={isRejecting}
              onSelect={() =>
                reject(loanRequest.id, {
                  onSuccess: () => toast.success("درخواست وام رد شد"),
                  onError: () => toast.error("خطا در رد درخواست وام")
                })
              }
              className="flex justify-between items-center text-destructive"
            >
              <span>رد</span>
              <X className="size-4" />
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => setEditNoteOpen(true)} className="flex justify-between items-center">
            <span>ویرایش یادداشت</span>
            <Pencil className="size-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isDeleting}
            onSelect={() => deleteLoanRequest(loanRequest.id)}
            className="flex justify-between items-center text-destructive"
          >
            <span>حذف</span>
            <Trash className="size-4" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>

      <EditLoanRequestNoteDialog loanRequest={loanRequest} open={editNoteOpen} onOpenChange={setEditNoteOpen} />
    </DropdownMenu>
  );
}

export const columns: ColumnDef<LoanRequest>[] = [
  {
    id: "rowNumber",
    meta: { className: "w-[60px]" },
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
    meta: { className: "w-[calc(100%/11)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="کد" />,
    cell: ({ row }) => (
      <Badge variant="secondary">
        <FormattedNumber type="normal" value={row.original.code} />
      </Badge>
    )
  },
  {
    accessorKey: "account.user.identity.name",
    id: "userName",
    meta: { className: "w-[calc(100%/11)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="نام کاربر" />,
    cell: ({ row }) => <div className="font-medium">{row.original.account?.user?.identity.name ?? "—"}</div>
  },
  {
    accessorKey: "account.name",
    id: "accountName",
    meta: { className: "w-[calc(100%/11)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="حساب" />,
    cell: ({ row }) => <div>{row.original.account?.name ?? "—"}</div>
  },
  {
    accessorKey: "amount",
    id: "amount",
    meta: { className: "w-[calc(100%/11)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="مبلغ" />,
    cell: ({ row }) => <FormattedNumber type="price" value={Number(row.original.amount)} />
  },
  {
    accessorKey: "paymentMonths",
    id: "paymentMonths",
    meta: { className: "w-[calc(100%/11)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="تعداد ماه" />,
    cell: ({ row }) => (
      <div className="text-center">
        <FormattedNumber type="normal" value={row.original.paymentMonths} />
      </div>
    )
  },
  {
    accessorKey: "startDate",
    id: "startDate",
    meta: { className: "w-[calc(100%/11)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="تاریخ شروع" />,
    cell: ({ row }) => <FormattedDate value={row.original.startDate} />
  },
  {
    accessorKey: "status",
    id: "status",
    meta: { className: "w-[calc(100%/11)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="وضعیت" />,
    cell: ({ row }) => {
      const status = row.original.status;
      // eslint-disable-next-line security/detect-object-injection
      return <Badge variant={getStatusVariant(status)}>{LoanRequestStatusLabels[status]}</Badge>;
    }
  },
  {
    accessorKey: "note",
    id: "note",
    meta: { className: "w-[calc(100%/11)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="یادداشت" />,
    cell: ({ row }) => {
      const note = row.original.note;
      return note ? (
        <div className="truncate max-w-25" title={note}>
          {note}
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    }
  },
  {
    accessorKey: "createdAt",
    id: "createdAt",
    meta: { className: "w-[calc(100%/11)]" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="تاریخ ایجاد" />,
    cell: ({ row }) => <FormattedDate value={row.original.createdAt} />
  },
  {
    id: "actions",
    meta: { className: "w-[60px]" },
    header: "اقدامات",
    cell: ({ row }) => <ActionsCell loanRequest={row.original} />,
    enableSorting: false,
    enableHiding: false
  }
];
