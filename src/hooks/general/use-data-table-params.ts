"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useDataTableParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = React.useCallback(
    (key: string, value: string | number | null | undefined) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      // Always reset page when filtering changes, unless we are changing the page itself
      if (key !== "page") {
        newSearchParams.set("page", "1");
      }

      if (value === null || value === undefined || value === "") {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, String(value));
      }

      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const setParams = React.useCallback(
    (params: Record<string, string | number | null | undefined>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      let shouldResetPage = false;

      Object.entries(params).forEach(([key, value]) => {
        if (key !== "page") {
          shouldResetPage = true;
        }

        if (value === null || value === undefined || value === "") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      });

      if (shouldResetPage) {
        newSearchParams.set("page", "1");
      }

      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const removeParam = React.useCallback(
    (key: string) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      newSearchParams.delete(key);
      if (key !== "page") {
        newSearchParams.set("page", "1");
      }
      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const reset = React.useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  return {
    searchParams,
    setParam,
    setParams,
    removeParam,
    reset
  };
}
