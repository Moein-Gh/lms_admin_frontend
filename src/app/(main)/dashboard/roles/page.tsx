"use client";

import { PaginationControls } from "@/components/pagination-controls";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { usePagination } from "@/hooks/use-pagination";
import { useRoles } from "@/hooks/use-role";
import RolesCardList from "./_components/roles-card-list";

export default function RolesPage() {
  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });

  const { data, isLoading, error } = useRoles({ page: pagination.page, pageSize: pagination.pageSize });

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">نقش‌ها</h1>
      </div>

      {/* Simple list/table */}
      <Card className="w-full max-h-[70vh] overflow-hidden">
        <div className="hidden sm:block">
          <Table className="w-full table-fixed">
            <TableHeader>
              <tr className="text-sm text-muted-foreground">
                <TableHead className="px-4 py-3 text-end">کد</TableHead>
                <TableHead className="px-4 py-3 text-end">نام</TableHead>
                <TableHead className="px-4 py-3 text-end">کد کلید</TableHead>
                <TableHead className="px-4 py-3 text-end">توضیحات</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {data?.data.map((role) => (
                <TableRow key={role.id} className="border-t">
                  <TableCell className="px-4 py-3 text-sm">{role.code}</TableCell>
                  <TableCell className="px-4 py-3 text-sm font-medium">{role.name}</TableCell>
                  <TableCell className="px-4 py-3 text-sm font-mono">{role.key}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground truncate">
                    {role.description ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile: stacked cards */}
        <div className="block sm:hidden">
          <RolesCardList data={data ?? null} isLoading={isLoading} error={error} />
        </div>
      </Card>

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
