"use client";

import { useSearchParams } from "next/navigation";

import { PaginationControls } from "@/components/pagination-controls";
import { usePagination } from "@/hooks/use-pagination";
import { useUsers } from "@/hooks/use-user";
import { OrderDirection } from "@/types/api";
import { UsersCardList } from "./_components/users-card-list";
import { UsersHeader } from "./_components/users-header";
import { UsersTable } from "./_components/users-table";

export default function UsersPage() {
  const searchParams = useSearchParams();

  const pageParam = Number(searchParams.get("page") ?? 1);
  const pageSizeParam = Number(searchParams.get("per_page") ?? 10);
  const search = searchParams.get("search") ?? undefined;
  const isActiveParam = searchParams.get("isActive");
  const isActive = isActiveParam === "true" ? true : isActiveParam === "false" ? false : undefined;
  const orderBy = searchParams.get("orderBy") ?? undefined;
  const orderDir = searchParams.get("orderDir") as OrderDirection | undefined;
  const pagination = usePagination({ initialPage: pageParam, initialPageSize: pageSizeParam });
  const { data, isLoading, error } = useUsers({
    page: pagination.page,
    pageSize: pagination.pageSize,
    search,
    isActive,
    orderBy,
    orderDir
  });

  return (
    <div className="space-y-6">
      <UsersHeader total={data?.meta.totalItems} />

      {/* Desktop: Table view */}
      <div className="hidden sm:block">
        <UsersTable data={data ?? null} isLoading={isLoading} error={error} />
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
