"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { EntityFilterTrigger } from "@/components/filters";
import { PaginationControls } from "@/components/pagination-controls";
import { usePagination } from "@/hooks/use-pagination";
import { useUsers } from "@/hooks/use-user";
import { OrderDirection } from "@/types/api";
import { UserStatus } from "@/types/entities/user.type";

import {
  createSortValue,
  dateRangeToISO,
  defaultUserFilters,
  isoToDateRange,
  parseSortValue,
  userFilterConfig,
  type UserFilters
} from "./_components/user-filter-config";
import { UsersCardList } from "./_components/users-card-list";
import { UsersHeader } from "./_components/users-header";
import { UsersTable } from "./_components/users-table";

export default function UsersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = Number(searchParams.get("page") ?? 1);
  const pageSizeParam = Number(searchParams.get("per_page") ?? 10);
  const search = searchParams.get("search") ?? undefined;
  const statusParam = searchParams.get("status");

  // Parse date range filters
  const minCreatedAt = searchParams.get("minCreatedAt") ?? undefined;
  const maxCreatedAt = searchParams.get("maxCreatedAt") ?? undefined;
  const minUpdatedAt = searchParams.get("minUpdatedAt") ?? undefined;
  const maxUpdatedAt = searchParams.get("maxUpdatedAt") ?? undefined;

  const orderBy = searchParams.get("orderBy") ?? undefined;
  const orderDir = searchParams.get("orderDir") as OrderDirection | undefined;

  const pagination = usePagination({ initialPage: pageParam, initialPageSize: pageSizeParam });

  const { data, isLoading, error } = useUsers({
    page: pagination.page,
    pageSize: pagination.pageSize,
    search,
    status: statusParam ? (statusParam as UserStatus) : undefined,
    orderBy,
    orderDir,
    minCreatedAt,
    maxCreatedAt,
    minUpdatedAt,
    maxUpdatedAt
  });

  // Convert URL params to filter state
  const filters: UserFilters = React.useMemo(
    () => ({
      search: search ?? undefined,
      sortBy: createSortValue(orderBy, orderDir) ?? defaultUserFilters.sortBy,
      status: statusParam ?? undefined,
      // Store ISO strings for API
      minCreatedAt,
      maxCreatedAt,
      minUpdatedAt,
      maxUpdatedAt,
      // Convert ISO strings to Date tuples for UI
      createdAt: isoToDateRange(minCreatedAt, maxCreatedAt),
      updatedAt: isoToDateRange(minUpdatedAt, maxUpdatedAt)
    }),
    [search, orderBy, orderDir, statusParam, minCreatedAt, maxCreatedAt, minUpdatedAt, maxUpdatedAt]
  );

  // Handle filter changes - sync to URL
  const handleFiltersChange = React.useCallback(
    (newFilters: UserFilters) => {
      const params = new URLSearchParams();

      // Search
      if (newFilters.search) {
        params.set("search", newFilters.search);
      }

      // Status
      if (newFilters.status) {
        params.set("status", newFilters.status);
      }

      // Date range filters - convert from Date tuples to ISO strings
      const createdRange = dateRangeToISO(newFilters.createdAt);
      if (createdRange.min) params.set("minCreatedAt", createdRange.min);
      if (createdRange.max) params.set("maxCreatedAt", createdRange.max);

      const updatedRange = dateRangeToISO(newFilters.updatedAt);
      if (updatedRange.min) params.set("minUpdatedAt", updatedRange.min);
      if (updatedRange.max) params.set("maxUpdatedAt", updatedRange.max);

      // Sort
      if (newFilters.sortBy && newFilters.sortBy !== defaultUserFilters.sortBy) {
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
    <div className="space-y-6">
      <UsersHeader
        total={data?.meta.totalItems}
        filterTrigger={
          <EntityFilterTrigger
            config={userFilterConfig}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleReset}
            resultCount={data?.meta.totalItems}
          />
        }
      />

      {/* Desktop: Table view */}
      <div className="hidden sm:block">
        <UsersTable
          data={data ?? null}
          isLoading={isLoading}
          error={error}
          filterConfig={userFilterConfig}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleReset}
        />
      </div>

      {/* Mobile: Card view */}
      <div className="block sm:hidden">
        <UsersCardList data={data ?? null} isLoading={isLoading} error={error} />
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
