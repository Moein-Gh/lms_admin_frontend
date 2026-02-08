"use client";

import * as React from "react";
import {
  ColumnDef,
  getCoreRowModel,
  OnChangeFn,
  SortingState,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table";

import { useDataTableParams } from "@/hooks/general/use-data-table-params";

interface UseServerDataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pageCount: number;
}

export function useServerDataTable<TData, TValue>({
  data,
  columns,
  pageCount
}: UseServerDataTableProps<TData, TValue>) {
  const { searchParams, setParams } = useDataTableParams();

  // Sync URL sort to Table State
  const sorting: SortingState = React.useMemo(() => {
    const orderBy = searchParams.get("orderBy");
    const orderDir = searchParams.get("orderDir");
    if (!orderBy) return [];
    return [{ id: orderBy, desc: orderDir === "desc" }];
  }, [searchParams]);

  const onSortingChange: OnChangeFn<SortingState> = React.useCallback(
    (updaterOrValue) => {
      const newSorting = typeof updaterOrValue === "function" ? updaterOrValue(sorting) : updaterOrValue;

      const firstSort = newSorting[0];
      if (firstSort) {
        setParams({
          orderBy: firstSort.id,
          orderDir: firstSort.desc ? "desc" : "asc"
        });
      } else {
        setParams({
          orderBy: null,
          orderDir: null
        });
      }
    },
    [setParams, sorting]
  );

  // Pagination state
  const pagination = React.useMemo(() => {
    return {
      pageIndex: Number(searchParams.get("page") ?? 1) - 1,
      pageSize: Number(searchParams.get("per_page") ?? 10)
    };
  }, [searchParams]);

  const onPaginationChange: OnChangeFn<{ pageIndex: number; pageSize: number }> = React.useCallback(
    (updaterOrValue) => {
      const newPagination = typeof updaterOrValue === "function" ? updaterOrValue(pagination) : updaterOrValue;

      setParams({
        page: newPagination.pageIndex + 1,
        per_page: newPagination.pageSize
      });
    },
    [setParams, pagination]
  );

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      pagination,
      columnVisibility
    },
    onSortingChange,
    onPaginationChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true
  });

  return table;
}
