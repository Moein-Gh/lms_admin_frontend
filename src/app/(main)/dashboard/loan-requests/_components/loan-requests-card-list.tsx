"use client";

import * as React from "react";
import { Check, MoreHorizontal, Pencil, Trash, X } from "lucide-react";
import { toast } from "sonner";

import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DataCardConfig,
  DataCardEmpty,
  DataCardError,
  DataCardList,
  DataCardSkeleton
} from "@/components/ui/data-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useApproveLoanRequest, useDeleteLoanRequest, useRejectLoanRequest } from "@/hooks/use-loan-request";
import { PaginatedResponseDto } from "@/types/api";
import { LoanRequest, LoanRequestStatus, LoanRequestStatusLabels } from "@/types/entities/loan-request.type";

import { EditLoanRequestNoteDialog } from "./edit-loan-request-note-dialog";

type Props = {
  data: PaginatedResponseDto<LoanRequest> | null;
  isLoading: boolean;
  error: unknown;
};

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

function LoanRequestActions({ loanRequest }: { loanRequest: LoanRequest }) {
  const { mutate: approve, isPending: isApproving } = useApproveLoanRequest();
  const { mutate: reject, isPending: isRejecting } = useRejectLoanRequest();
  const { mutate: deleteLoanRequest, isPending: isDeleting } = useDeleteLoanRequest();
  const [editNoteOpen, setEditNoteOpen] = React.useState(false);

  const canApprove = loanRequest.status === LoanRequestStatus.PENDING;
  const canReject = loanRequest.status === LoanRequestStatus.PENDING;

  return [
    {
      icon: <MoreHorizontal className="size-5" />,
      label: "اقدامات",
      onClick: () => {},
      renderCustom: () => (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="size-9">
              <MoreHorizontal className="size-4" />
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
      )
    }
  ];
}

const loanRequestCardConfig: DataCardConfig<LoanRequest> = {
  primaryField: "account",
  renderPrimary: (k, req) => req.account?.user?.identity.name ?? req.account?.name ?? `درخواست ${req.code}`,
  secondaryField: "code",
  renderSecondary: (code) => <FormattedNumber type="normal" value={code as number} />,
  badge: {
    field: "amount",
    render: (amt) => <FormattedNumber type="price" value={Number(amt) || 0} />
  },
  statusColor: (req) => {
    switch (req.status) {
      case LoanRequestStatus.APPROVED:
        return "bg-success";
      case LoanRequestStatus.IN_QUEUE:
        return "bg-blue-500";
      case LoanRequestStatus.PENDING:
        return "bg-amber-500";
      case LoanRequestStatus.REJECTED:
        return "bg-destructive";
      default:
        return "bg-muted-foreground";
    }
  },
  detailFields: [
    {
      key: "status",
      label: "وضعیت",
      render: (s) => {
        const status = s as LoanRequestStatus;
        // eslint-disable-next-line security/detect-object-injection
        return <Badge variant={getStatusVariant(status)}>{LoanRequestStatusLabels[status]}</Badge>;
      }
    },
    {
      key: "startDate",
      label: "تاریخ شروع",
      render: (v) => <FormattedDate value={v as unknown as Date} />
    },
    {
      key: "paymentMonths",
      label: "تعداد ماه",
      render: (v) => <FormattedNumber type="normal" value={v as number} />
    },
    {
      key: "loanType",
      label: "نوع وام",
      render: (v) => String((v as LoanRequest["loanType"])?.name ?? "-")
    },
    {
      key: "note",
      label: "یادداشت",
      render: (v) => {
        const note = String(v ?? "");
        return note ? (
          <div className="truncate max-w-40" title={note}>
            {note}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      }
    }
  ],
  actions: (req) => LoanRequestActions({ loanRequest: req })
};

export function LoanRequestsCardList({ data, isLoading, error }: Props) {
  if (error) return <DataCardError />;
  if (isLoading) return <DataCardSkeleton count={5} />;
  if (!data || data.data.length === 0) return <DataCardEmpty message="درخواستی یافت نشد" />;

  return <DataCardList data={data.data} config={loanRequestCardConfig} keyExtractor={(r) => r.id} />;
}
