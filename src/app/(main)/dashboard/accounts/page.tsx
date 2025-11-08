"use client";
import { useState } from "react";

import { PaginationControls } from "@/components/pagination-controls";
import { useAccounts } from "@/hooks/use-account";
import { usePagination } from "@/hooks/use-pagination";

import { AccountFilters } from "./_components/account-filters-dialog";
import { AccountsHeader } from "./_components/accounts-header";
import { AccountsTable } from "./_components/accounts-table";
import { ActiveFilters } from "./_components/active-filters";

export default function AccountsPage() {
  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });
  const [filters, setFilters] = useState<AccountFilters>({
    search: "",
    accountTypeId: undefined,
    userId: undefined,
    status: undefined
  });

  const { data, isLoading, error } = useAccounts({
    page: pagination.page,
    pageSize: pagination.pageSize,
    search: filters.search,
    accountTypeId: filters.accountTypeId,
    userId: filters.userId,
    status: filters.status
  });

  const handleFiltersChange = (newFilters: AccountFilters) => {
    setFilters(newFilters);
    pagination.goToFirstPage();
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      accountTypeId: undefined,
      userId: undefined,
      status: undefined
    });
    pagination.goToFirstPage();
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      <AccountsHeader filters={filters} onFiltersChange={handleFiltersChange} onReset={handleResetFilters} />

      <ActiveFilters filters={filters} onReset={handleResetFilters} />

      <div className="w-full min-w-0">
        <AccountsTable
          data={data ?? null}
          isLoading={isLoading}
          error={error}
          pagination={{ page: pagination.page, pageSize: pagination.pageSize }}
        />
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
