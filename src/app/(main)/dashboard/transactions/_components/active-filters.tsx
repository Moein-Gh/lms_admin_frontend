"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/hooks/use-user";
import { TransactionStatus, TransactionKind } from "@/types/entities/transaction.type";
import { TransactionFilters } from "./transaction-filters";

interface Props {
  filters: TransactionFilters;
  onReset: () => void;
}

function statusLabel(status: TransactionStatus) {
  switch (status) {
    case TransactionStatus.APPROVED:
      return "تایید شده";
    case TransactionStatus.PENDING:
      return "در انتظار";
    case TransactionStatus.REJECTED:
      return "رد شده";
    case TransactionStatus.ALLOCATED:
      return "تخصیص یافته";
    default:
      return status;
  }
}

function kindLabel(kind?: TransactionKind) {
  switch (kind) {
    case "DEPOSIT":
      return "واریز";
    case "WITHDRAWAL":
      return "برداشت";
    case "LOAN_DISBURSEMENT":
      return "پرداخت وام";
    case "LOAN_REPAYMENT":
      return "بازپرداخت وام";
    case "SUBSCRIPTION_PAYMENT":
      return "پرداخت اشتراک";
    case "FEE":
      return "کارمزد";
    default:
      return "-";
  }
}

function getUserDisplay(usersData: ReturnType<typeof useUsers>["data"], id?: string) {
  if (!id) return undefined;
  const u = usersData?.data.find((x) => x.id === id);
  return u?.identity.name ?? u?.identity.phone;
}

function renderBadges(filters: TransactionFilters, usersData: ReturnType<typeof useUsers>["data"]) {
  const nodes: React.ReactNode[] = [];

  if (filters.search && String(filters.search).trim() !== "") {
    nodes.push(
      <Badge key="search" variant="secondary">
        جستجو: {filters.search}
      </Badge>
    );
  }

  if (filters.kind) {
    nodes.push(
      <Badge key="kind" variant="secondary">
        نوع تراکنش: {kindLabel(filters.kind)}
      </Badge>
    );
  }

  if (filters.userId) {
    nodes.push(
      <Badge key="userId" variant="secondary">
        کاربر: {getUserDisplay(usersData, filters.userId) ?? "در حال بارگذاری..."}
      </Badge>
    );
  }

  if (filters.status) {
    nodes.push(
      <Badge key="status" variant="secondary">
        وضعیت: {statusLabel(filters.status)}
      </Badge>
    );
  }

  return nodes;
}

export function ActiveFilters({ filters, onReset }: Props) {
  const { data: usersData } = useUsers({ pageSize: 100 });

  const hasFilters =
    (filters.search && String(filters.search).trim() !== "") || !!filters.kind || !!filters.userId || !!filters.status;

  if (!hasFilters) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-muted-foreground text-sm">فیلترهای فعال:</span>

      {renderBadges(filters, usersData)}

      <Button variant="ghost" size="sm" onClick={onReset} className="h-6 px-2 text-xs">
        پاک کردن همه
      </Button>
    </div>
  );
}
