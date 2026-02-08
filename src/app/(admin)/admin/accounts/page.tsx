"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { EntityFilterTrigger } from "@/components/filters";
import { PaginationControls } from "@/components/pagination-controls";
import { useAccounts } from "@/hooks/admin/use-account";
import { useAccountTypes } from "@/hooks/admin/use-account-type";
import { useUsers } from "@/hooks/admin/use-user";
import { usePagination } from "@/hooks/general/use-pagination";
import { OrderDirection } from "@/types/api";
import { AccountStatus } from "@/types/entities/account.type";

import {
  accountFilterConfig,
  createSortValue,
  dateRangeToISO,
  defaultAccountFilters,
  isoToDateRange,
  parseSortValue,
  type AccountFilters
} from "./_components/account-filter-config";
import { AccountsCardList } from "./_components/accounts-card-list";
import { AccountsHeader } from "./_components/accounts-header";
import { AccountsTable } from "./_components/accounts-table";

export default function AccountsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = Number(searchParams.get("page") ?? 1);
  const pageSizeParam = Number(searchParams.get("per_page") ?? 10);
  const search = searchParams.get("search") ?? undefined;
  const statusParam = searchParams.get("status");

  // Parse multi-select filters as arrays
  const accountTypeIdParam = searchParams.get("accountTypeId")?.split(",").filter(Boolean) ?? undefined;
  const userIdParam = searchParams.get("userId")?.split(",").filter(Boolean) ?? undefined;
  const bankNameParam = searchParams.get("bankName")?.split(",").filter(Boolean) ?? undefined;

  // Parse date range filters
  const minCreatedAt = searchParams.get("minCreatedAt") ?? undefined;
  const maxCreatedAt = searchParams.get("maxCreatedAt") ?? undefined;
  const minUpdatedAt = searchParams.get("minUpdatedAt") ?? undefined;
  const maxUpdatedAt = searchParams.get("maxUpdatedAt") ?? undefined;

  const orderBy = searchParams.get("orderBy") ?? undefined;
  const orderDir = searchParams.get("orderDir") as OrderDirection | undefined;

  const pagination = usePagination({ initialPage: pageParam, initialPageSize: pageSizeParam });

  // Load account types and users for filter options
  const { data: accountTypesData } = useAccountTypes({ page: 1, pageSize: 100 });
  const { data: usersData } = useUsers({ page: 1, pageSize: 100 });

  const { data, isLoading, error } = useAccounts({
    page: pagination.page,
    pageSize: pagination.pageSize,
    search,
    // API accepts only single values, so take the first from multi-select arrays
    accountTypeId: accountTypeIdParam?.[0],
    userId: userIdParam?.[0],
    status: statusParam ? (statusParam as AccountStatus) : undefined,
    orderBy,
    orderDir,
    minCreatedAt,
    maxCreatedAt,
    minUpdatedAt,
    maxUpdatedAt
  });

  // Inject dynamic options into the filter config
  const mergedConfig = React.useMemo(() => {
    const cfg = { ...accountFilterConfig };
    cfg.filters = cfg.filters.map((f) => {
      if (f.key === "accountTypeId") {
        return {
          ...f,
          options: (accountTypesData?.data ?? []).map((t) => ({ value: t.id, label: t.name }))
        };
      }

      if (f.key === "userId") {
        return {
          ...f,
          options: (usersData?.data ?? []).map((u) => ({ value: u.id, label: u.identity.name ?? String(u.code) }))
        };
      }

      if (f.key === "code" && f.type === "range") {
        // Update code max to total number of accounts
        return {
          ...f,
          max: data?.meta.totalItems ?? f.max
        };
      }

      return f;
    });

    return cfg;
  }, [accountTypesData, usersData, data?.meta.totalItems]);

  // Convert URL params to filter state
  const filters: AccountFilters = React.useMemo(
    () => ({
      search: search ?? undefined,
      sortBy: createSortValue(orderBy, orderDir) ?? defaultAccountFilters.sortBy,
      status: statusParam ?? undefined,
      accountTypeId: accountTypeIdParam,
      userId: userIdParam,
      bankName: bankNameParam,
      // Store ISO strings for API
      minCreatedAt,
      maxCreatedAt,
      minUpdatedAt,
      maxUpdatedAt,
      // Convert ISO strings to Date tuples for UI
      createdAt: isoToDateRange(minCreatedAt, maxCreatedAt),
      updatedAt: isoToDateRange(minUpdatedAt, maxUpdatedAt)
    }),
    [
      search,
      orderBy,
      orderDir,
      statusParam,
      accountTypeIdParam,
      userIdParam,
      bankNameParam,
      minCreatedAt,
      maxCreatedAt,
      minUpdatedAt,
      maxUpdatedAt
    ]
  );

  // Handle filter changes - sync to URL
  const handleFiltersChange = React.useCallback(
    (newFilters: AccountFilters) => {
      const params = new URLSearchParams();

      // Search
      if (newFilters.search) {
        params.set("search", newFilters.search);
      }

      // Status
      if (newFilters.status) {
        params.set("status", newFilters.status);
      }

      // Account Type ID (multi-select - array)
      if (newFilters.accountTypeId && newFilters.accountTypeId.length > 0) {
        params.set("accountTypeId", newFilters.accountTypeId.join(","));
      }

      // User ID (multi-select - array)
      if (newFilters.userId && newFilters.userId.length > 0) {
        params.set("userId", newFilters.userId.join(","));
      }

      // Bank Name (multi-select - array)
      if (newFilters.bankName && newFilters.bankName.length > 0) {
        params.set("bankName", newFilters.bankName.join(","));
      }

      // Date range filters - convert from Date tuples to ISO strings
      const createdRange = dateRangeToISO(newFilters.createdAt);
      if (createdRange.min) params.set("minCreatedAt", createdRange.min);
      if (createdRange.max) params.set("maxCreatedAt", createdRange.max);

      const updatedRange = dateRangeToISO(newFilters.updatedAt);
      if (updatedRange.min) params.set("minUpdatedAt", updatedRange.min);
      if (updatedRange.max) params.set("maxUpdatedAt", updatedRange.max);

      // Sort
      if (newFilters.sortBy && newFilters.sortBy !== defaultAccountFilters.sortBy) {
        const { orderBy: newOrderBy, orderDir: newOrderDir } = parseSortValue(newFilters.sortBy);
        if (newOrderBy) params.set("orderBy", newOrderBy);
        if (newOrderDir) params.set("orderDir", newOrderDir);
      }

      // Reset to page 1 when filters change
      params.set("page", "1");
      params.set("per_page", String(pagination.pageSize));

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, pagination.pageSize]
  );

  // Handle filter reset
  const handleReset = React.useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return (
    <div className="space-y-6 w-full min-w-0">
      <AccountsHeader
        total={data?.meta.totalItems}
        filterTrigger={
          <EntityFilterTrigger
            config={mergedConfig}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleReset}
          />
        }
      />

      {/* Desktop: Table view */}
      <div className="hidden sm:block">
        <AccountsTable
          data={data ?? null}
          isLoading={isLoading}
          error={error}
          filterConfig={mergedConfig}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleReset}
        />
      </div>

      {/* Mobile: Card view */}
      <div className="block sm:hidden">
        <AccountsCardList data={data ?? null} isLoading={isLoading} error={error} />
      </div>

      {/* Pagination */}
      {data && (
        <div className="border-t p-4">
          <PaginationControls
            meta={data.meta}
            page={pagination.page}
            pageSize={pagination.pageSize}
            onPageChange={pagination.setPage}
            onPageSizeChange={pagination.setPageSize}
          />
        </div>
      )}
    </div>
  );
}
