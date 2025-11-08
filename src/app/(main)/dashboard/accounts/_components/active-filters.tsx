"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAccountTypes } from "@/hooks/use-account-type";
import { useUsers } from "@/hooks/use-user";
import { AccountStatus } from "@/types/entities/account.type";

import { AccountFilters } from "./account-filters-dialog";

type Props = {
  filters: AccountFilters;
  onReset: () => void;
};

function statusLabel(status: AccountStatus) {
  switch (status) {
    case AccountStatus.ACTIVE:
      return "فعال";
    case AccountStatus.INACTIVE:
      return "غیرفعال";
    case AccountStatus.RESTRICTED:
      return "محدود";
    default:
      return status;
  }
}

function getAccountTypeName(accountTypesData: ReturnType<typeof useAccountTypes>["data"], id?: string) {
  if (!id) return undefined;
  return accountTypesData?.data.find((t) => t.id === id)?.name;
}

function getUserDisplay(usersData: ReturnType<typeof useUsers>["data"], id?: string) {
  if (!id) return undefined;
  const u = usersData?.data.find((x) => x.id === id);
  return u?.identity.name ?? u?.identity.phone;
}

function renderBadges(
  filters: AccountFilters,
  accountTypesData: ReturnType<typeof useAccountTypes>["data"],
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

  if (filters.accountTypeId) {
    nodes.push(
      <Badge key="accountTypeId" variant="secondary">
        نوع حساب: {getAccountTypeName(accountTypesData, filters.accountTypeId) ?? "در حال بارگذاری..."}
      </Badge>
    );
  }

  if (filters.userId) {
    nodes.push(
      <Badge key="userId" variant="secondary">
        دارنده حساب: {getUserDisplay(usersData, filters.userId) ?? "در حال بارگذاری..."}
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
  const { data: accountTypesData } = useAccountTypes({ pageSize: 100 });
  const { data: usersData } = useUsers({ pageSize: 100 });

  const hasFilters =
    (filters.search && String(filters.search).trim() !== "") ||
    !!filters.accountTypeId ||
    !!filters.userId ||
    !!filters.status;

  if (!hasFilters) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-muted-foreground text-sm">فیلترهای فعال:</span>

      {renderBadges(filters, accountTypesData, usersData)}

      <Button variant="ghost" size="sm" onClick={onReset} className="h-6 px-2 text-xs">
        پاک کردن همه
      </Button>
    </div>
  );
}
