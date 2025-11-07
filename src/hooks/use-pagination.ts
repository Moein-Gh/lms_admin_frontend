import { useState } from "react";

import type { PageMetaDto } from "@/types/api";

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
}

export interface UsePaginationReturn {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  goToFirstPage: () => void;
  goToLastPage: (meta?: PageMetaDto) => void;
  goToNextPage: (meta?: PageMetaDto) => void;
  goToPrevPage: () => void;
  canGoNext: (meta?: PageMetaDto) => boolean;
  canGoPrev: () => boolean;
  reset: () => void;
}

/**
 * Hook for managing pagination state
 */
export function usePagination(
  options: UsePaginationOptions = {},
): UsePaginationReturn {
  const { initialPage = 1, initialPageSize = 10 } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const goToFirstPage = () => setPage(1);

  const goToLastPage = (meta?: PageMetaDto) => {
    if (meta) {
      setPage(meta.totalPages);
    }
  };

  const goToNextPage = (meta?: PageMetaDto) => {
    if (meta && meta.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const canGoNext = (meta?: PageMetaDto) => {
    return meta ? meta.hasNextPage : false;
  };

  const canGoPrev = () => {
    return page > 1;
  };

  const reset = () => {
    setPage(initialPage);
    setPageSize(initialPageSize);
  };

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPrevPage,
    canGoNext,
    canGoPrev,
    reset,
  };
}
