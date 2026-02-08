"use client";

import * as React from "react";
import { Calendar, Check, FileText, MoreVertical, Pencil, Trash, X } from "lucide-react";
import { toast } from "sonner";

import { EmptyStateCard } from "@/components/empty-state-card";
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useApproveLoanRequest,
  useDeleteLoanRequest,
  useLoanRequests,
  useRejectLoanRequest
} from "@/hooks/admin/use-loan-request";
import { formatPersianDate, DATE_FORMATS } from "@/lib/date-service";
import { cn } from "@/lib/utils";
import { LoanRequest, LoanRequestStatus } from "@/types/entities/loan-request.type";

import { EditLoanRequestNoteDialog } from "../../../loan-requests/_components/edit-loan-request-note-dialog";

const getStatusConfig = (status: LoanRequestStatus) => {
  switch (status) {
    case LoanRequestStatus.PENDING:
      return {
        label: "در انتظار",
        dotClass: "bg-amber-500",
        badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
      };
    case LoanRequestStatus.IN_QUEUE:
      return {
        label: "در صف بررسی",
        dotClass: "bg-blue-500",
        badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
      };
    case LoanRequestStatus.APPROVED:
      return {
        label: "تایید شده",
        dotClass: "bg-emerald-500",
        badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      };
    case LoanRequestStatus.REJECTED:
      return {
        label: "رد شده",
        dotClass: "bg-red-500",
        badgeClass: "bg-red-500/10 text-red-600 dark:text-red-400"
      };
    case LoanRequestStatus.CONVERTED:
      return {
        label: "تبدیل شده",
        dotClass: "bg-purple-500",
        badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400"
      };
    default:
      return {
        label: "نامشخص",
        dotClass: "bg-gray-400",
        badgeClass: "bg-gray-500/10 text-gray-600 dark:text-gray-400"
      };
  }
};

function LoanRequestCard({ loanRequest }: { loanRequest: LoanRequest }) {
  const statusConfig = getStatusConfig(loanRequest.status);
  const { mutate: approve, isPending: isApproving } = useApproveLoanRequest();
  const { mutate: reject, isPending: isRejecting } = useRejectLoanRequest();
  const { mutate: deleteLoanRequest, isPending: isDeleting } = useDeleteLoanRequest();
  const [editNoteOpen, setEditNoteOpen] = React.useState(false);

  const canApprove = loanRequest.status === LoanRequestStatus.PENDING;
  const canReject = loanRequest.status === LoanRequestStatus.PENDING;

  return (
    <div className="card-container flex flex-col">
      {/* Header: Icon + Type + Status + Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/5">
            <FileText className="size-5 text-primary" />
          </div>
          <Badge variant="outline" className="text-[10px] font-medium">
            {loanRequest.loanType?.name ?? "نوع نامشخص"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn("gap-1.5 border-0 text-[10px] font-medium", statusConfig.badgeClass)}>
            <span className={cn("size-1.5 rounded-full", statusConfig.dotClass)} />
            {statusConfig.label}
          </Badge>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="size-9 md:size-10">
                <MoreVertical className="size-5" />
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
                  onSelect={() =>
                    deleteLoanRequest(loanRequest.id, {
                      onSuccess: () => toast.success("درخواست وام حذف شد"),
                      onError: () => toast.error("خطا در حذف درخواست وام")
                    })
                  }
                  className="flex justify-between items-center text-destructive"
                >
                  <span>حذف</span>
                  <Trash className="size-4" />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Loan Request Code */}
      <div className="mt-3">
        <h3 className="text-base font-semibold leading-tight">درخواست #{loanRequest.code}</h3>
      </div>

      <Separator className="my-3" />

      {/* Loan Request Details */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">مبلغ</span>
          <FormattedNumber type="price" value={loanRequest.amount} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">تاریخ شروع</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 text-muted-foreground" />
            <span className="text-sm">{formatPersianDate(loanRequest.startDate, DATE_FORMATS.SHORT)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">تعداد اقساط</span>
          <span className="text-sm font-medium">{loanRequest.paymentMonths} ماه</span>
        </div>
      </div>

      <EditLoanRequestNoteDialog loanRequest={loanRequest} open={editNoteOpen} onOpenChange={setEditNoteOpen} />
    </div>
  );
}

type UserLoanRequestsProps = {
  userId: string;
};

const UserLoanRequests = ({ userId }: UserLoanRequestsProps) => {
  const { data, isLoading } = useLoanRequests({
    userId: userId
  });

  const loanRequests = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-52 rounded-xl" />
        ))}
      </div>
    );
  }

  if (loanRequests.length === 0) {
    return (
      <EmptyStateCard
        icon={<FileText />}
        title="درخواست وامی یافت نشد"
        description="هیچ درخواست وامی برای این کاربر ثبت نشده است"
      />
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {loanRequests.map((loanRequest) => (
        <LoanRequestCard key={loanRequest.id} loanRequest={loanRequest} />
      ))}
    </div>
  );
};

export default UserLoanRequests;
