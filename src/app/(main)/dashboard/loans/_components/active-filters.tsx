"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLoanTypes } from "@/hooks/use-loan-type";
import { useUsers } from "@/hooks/use-user";
import { LoanStatus, LoanStatusLabels } from "@/types/entities/loan.type";

import { LoanFilters } from "./loan-filters-dialog";

type Props = {
  filters: LoanFilters;
  onReset: () => void;
};

function statusLabel(status: LoanStatus) {
  return LoanStatusLabels[status];
}

function getLoanTypeName(loanTypesData: ReturnType<typeof useLoanTypes>["data"], id?: string) {
  if (!id) return undefined;
  return loanTypesData?.data.find((t) => t.id === id)?.name;
}

function getUserDisplay(usersData: ReturnType<typeof useUsers>["data"], id?: string) {
  if (!id) return undefined;
  const u = usersData?.data.find((x) => x.id === id);
  return u?.identity.name ?? u?.identity.phone;
}

function renderBadges(
  filters: LoanFilters,
  loanTypesData: ReturnType<typeof useLoanTypes>["data"],
  usersData: ReturnType<typeof useUsers>["data"]
) {
  const nodes: React.ReactNode[] = [];

  if (filters.search && String(filters.search).trim() !== "") {
    nodes.push(
      <Badge key="search" variant="secondary">
        جستجو: {filters.search}
      </Badge>
    );
  }

  if (filters.loanTypeId) {
    nodes.push(
      <Badge key="loanTypeId" variant="secondary">
        نوع وام: {getLoanTypeName(loanTypesData, filters.loanTypeId) ?? "در حال بارگذاری..."}
      </Badge>
    );
  }

  if (filters.userId) {
    nodes.push(
      <Badge key="userId" variant="secondary">
        دارنده وام: {getUserDisplay(usersData, filters.userId) ?? "در حال بارگذاری..."}
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
  const { data: loanTypesData } = useLoanTypes({ pageSize: 100 });
  const { data: usersData } = useUsers({ pageSize: 100 });

  const hasFilters =
    (filters.search && String(filters.search).trim() !== "") ||
    !!filters.loanTypeId ||
    !!filters.userId ||
    !!filters.status;

  if (!hasFilters) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-muted-foreground text-sm">فیلترهای فعال:</span>

      {renderBadges(filters, loanTypesData, usersData)}

      <Button variant="ghost" size="sm" onClick={onReset} className="h-6 px-2 text-xs">
        پاک کردن همه
      </Button>
    </div>
  );
}
