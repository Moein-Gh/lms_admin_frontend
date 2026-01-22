"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EntityFilterTrigger } from "@/components/filters";
import { PaginationControls } from "@/components/pagination-controls";
import { useLoanRequests } from "@/hooks/use-loan-request";
import { usePagination } from "@/hooks/use-pagination";
import { useUsers } from "@/hooks/use-user";
import { OrderDirection } from "@/types/api";
import { LoanRequestStatus } from "@/types/entities/loan-request.type";

import {
  createSortValue,
  dateRangeToISO,
  defaultLoanRequestFilters,
  isoToDateRange,
  loanRequestFilterConfig,
  parseSortValue,
  type LoanRequestFilters
} from "./_components/loan-request-filter-config";
import { LoanRequestsCardList } from "./_components/loan-requests-card-list";
import { LoanRequestsHeader } from "./_components/loan-requests-header";
import { LoanRequestsTable } from "./_components/loan-requests-table";

export default function LoanRequestsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = Number(searchParams.get("page") ?? 1);
  const pageSizeParam = Number(searchParams.get("per_page") ?? 10);
  const search = searchParams.get("search") ?? undefined;
  const statusParam = searchParams.get("status");
  const userIdParam = searchParams.get("userId")?.split(",").filter(Boolean) ?? undefined;

  const minCreatedAt = searchParams.get("minCreatedAt") ?? undefined;
  const maxCreatedAt = searchParams.get("maxCreatedAt") ?? undefined;
  const minUpdatedAt = searchParams.get("minUpdatedAt") ?? undefined;
  const maxUpdatedAt = searchParams.get("maxUpdatedAt") ?? undefined;

  const orderBy = searchParams.get("orderBy") ?? undefined;
  const orderDir = searchParams.get("orderDir") as OrderDirection | undefined;

  const pagination = usePagination({ initialPage: pageParam, initialPageSize: pageSizeParam });

  const { data, isLoading, error } = useLoanRequests({
    page: pagination.page,
    pageSize: pagination.pageSize,
    search,
    status: statusParam ? (statusParam as LoanRequestStatus) : undefined,
    userId: userIdParam?.[0],
    orderBy,
    orderDir,
    minCreatedAt,
    maxCreatedAt,
    minUpdatedAt,
    maxUpdatedAt
  });

  const { data: usersData } = useUsers({ page: 1, pageSize: 100 });

  const mergedConfig = React.useMemo(() => {
    const cfg = { ...loanRequestFilterConfig };
    cfg.filters = cfg.filters.map((f) => {
      if (f.key === "userId") {
        return {
          ...f,
          options: (usersData?.data ?? []).map((u) => ({ value: u.id, label: u.identity.name ?? String(u.code) }))
        };
      }
      return f;
    });
    return cfg;
  }, [usersData]);

  const filters: LoanRequestFilters = React.useMemo(
    () => ({
      search: search ?? undefined,
      sortBy: createSortValue(orderBy, orderDir) ?? defaultLoanRequestFilters.sortBy,
      status: statusParam ?? undefined,
      userId: userIdParam,
      minCreatedAt,
      maxCreatedAt,
      minUpdatedAt,
      maxUpdatedAt,
      createdAt: isoToDateRange(minCreatedAt, maxCreatedAt),
      updatedAt: isoToDateRange(minUpdatedAt, maxUpdatedAt)
    }),
    [search, orderBy, orderDir, statusParam, userIdParam, minCreatedAt, maxCreatedAt, minUpdatedAt, maxUpdatedAt]
  );

  const handleFiltersChange = React.useCallback(
    (newFilters: LoanRequestFilters) => {
      const params = new URLSearchParams();

      if (newFilters.search) {
        params.set("search", newFilters.search);
      }

      if (newFilters.status) {
        params.set("status", newFilters.status);
      }

      if (newFilters.userId && Array.isArray(newFilters.userId) && newFilters.userId.length > 0) {
        params.set("userId", newFilters.userId.join(","));
      }

      const createdRange = dateRangeToISO(newFilters.createdAt);
      if (createdRange.min) params.set("minCreatedAt", createdRange.min);
      if (createdRange.max) params.set("maxCreatedAt", createdRange.max);

      const updatedRange = dateRangeToISO(newFilters.updatedAt);
      if (updatedRange.min) params.set("minUpdatedAt", updatedRange.min);
      if (updatedRange.max) params.set("maxUpdatedAt", updatedRange.max);

      const { orderBy: newOrderBy, orderDir: newOrderDir } = parseSortValue(newFilters.sortBy);
      if (newOrderBy) params.set("orderBy", newOrderBy);
      if (newOrderDir) params.set("orderDir", newOrderDir);

      params.set("page", "1");
      params.set("per_page", String(pagination.pageSize));

      router.push(`${pathname}?${params.toString()}`);
      pagination.setPage(1);
    },
    [pathname, router, pagination]
  );

  const handleReset = React.useCallback(() => {
    router.push(pathname);
    pagination.setPage(1);
  }, [pathname, router, pagination]);

  const handlePageChange = React.useCallback(
    (newPage: number, newPageSize: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      params.set("per_page", String(newPageSize));
      router.push(`${pathname}?${params.toString()}`);
      pagination.setPage(newPage);
      pagination.setPageSize(newPageSize);
    },
    [pathname, router, searchParams, pagination]
  );

  return (
    <div className="space-y-4">
      <LoanRequestsHeader
        filterTrigger={
          <EntityFilterTrigger
            config={mergedConfig}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleReset}
            resultCount={data?.meta.totalItems}
          />
        }
      />

      <div className="hidden md:block">
        <LoanRequestsTable
          data={data ?? null}
          isLoading={isLoading}
          error={error}
          filterConfig={mergedConfig}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleReset}
        />
      </div>

      <div className="md:hidden">
        <LoanRequestsCardList data={data ?? null} isLoading={isLoading} error={error} />
      </div>

      {data && (
        <PaginationControls
          meta={data.meta}
          page={pagination.page}
          pageSize={pagination.pageSize}
          onPageChange={(newPage) => handlePageChange(newPage, pagination.pageSize)}
          onPageSizeChange={(newPageSize) => handlePageChange(1, newPageSize)}
        />
      )}
    </div>
  );
}
