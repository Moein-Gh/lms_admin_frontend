"use client";
import { useState } from "react";

import { PaginationControls } from "@/components/pagination-controls";
import { usePagination } from "@/hooks/use-pagination";
import { useUsers } from "@/hooks/use-user";
import { ActiveFilters } from "./_components/active-filters";
import { UserFilters } from "./_components/user-filters-dialog";

import { UsersHeader } from "./_components/users-header";
import { UsersTable } from "./_components/users-table";

export default function UsersPage() {
  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    isActive: undefined
  });

  const { data, isLoading, error } = useUsers({
    page: pagination.page,
    pageSize: pagination.pageSize,
    search: filters.search,
    isActive: filters.isActive
  });

  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
    pagination.goToFirstPage();
  };

  const handleResetFilters = () => {
    setFilters({ search: "", isActive: undefined });
    pagination.goToFirstPage();
  };

  return (
    <div className="space-y-6">
      <UsersHeader filters={filters} onFiltersChange={handleFiltersChange} onReset={handleResetFilters} />

      <ActiveFilters filters={filters} onReset={handleResetFilters} />

      <UsersTable
        data={data ?? null}
        isLoading={isLoading}
        error={error}
        pagination={{ page: pagination.page, pageSize: pagination.pageSize }}
      />

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
