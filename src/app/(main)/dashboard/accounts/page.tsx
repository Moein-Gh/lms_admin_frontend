"use client";
import { useState } from "react";

import { useSearchParams } from "next/navigation";
import { PaginationControls } from "@/components/pagination-controls";
import { useAccounts } from "@/hooks/use-account";
import { usePagination } from "@/hooks/use-pagination";

import { OrderDirection } from "@/types/api";
import { AccountFilters } from "./_components/account-filters-dialog";
import { AccountsCardList } from "./_components/accounts-card-list";
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

  const searchParams = useSearchParams();

  const orderBy = searchParams.get("orderBy") ?? undefined;
  const orderDir = searchParams.get("orderDir") as OrderDirection | undefined;

  const { data, isLoading, error } = useAccounts({
    page: pagination.page,
    pageSize: pagination.pageSize,
    search: filters.search,
    accountTypeId: filters.accountTypeId,
    userId: filters.userId,
    status: filters.status,
    orderBy,
    orderDir
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
      <AccountsHeader
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
        total={data?.meta.totalItems}
      />

      <ActiveFilters filters={filters} onReset={handleResetFilters} />

      {/* Desktop: Table view */}
      <div className="hidden sm:block">
        <AccountsTable data={data ?? null} isLoading={isLoading} error={error} />
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
