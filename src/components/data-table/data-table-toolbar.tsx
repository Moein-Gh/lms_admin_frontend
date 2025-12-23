"use client";

import * as React from "react";
import { X } from "lucide-react";

import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { DataTableSearch } from "@/components/data-table/data-table-search";
import { Button } from "@/components/ui/button";
import { useDataTableParams } from "@/hooks/use-data-table-params";

export type FilterSchema = {
  key: string;
  type: "search" | "select" | "date-range";
  label?: string;
  options?: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }[];
};

interface DataTableToolbarProps {
  filterSchema: FilterSchema[];
}

export function DataTableToolbar({ filterSchema }: DataTableToolbarProps) {
  const { searchParams, setParam, removeParam, reset } = useDataTableParams();

  const isFiltered = Array.from(searchParams.keys()).some(
    (key) => key !== "page" && key !== "per_page" && key !== "sort"
  );

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-2">
        {filterSchema.map((filter) => {
          if (filter.type === "search") {
            return (
              <DataTableSearch
                key={filter.key}
                value={searchParams.get(filter.key) ?? ""}
                onChange={(value) => setParam(filter.key, value)}
                placeholder={filter.label}
              />
            );
          }

          if (filter.type === "select" && filter.options) {
            const selectedValues = new Set(searchParams.get(filter.key)?.split(",").filter(Boolean) ?? []);
            return (
              <DataTableFacetedFilter
                key={filter.key}
                title={filter.label}
                options={filter.options}
                selectedValues={selectedValues}
                onSelect={(values) => {
                  if (values.size === 0) {
                    removeParam(filter.key);
                  } else {
                    setParam(filter.key, Array.from(values).join(","));
                  }
                }}
              />
            );
          }

          return null;
        })}
        {isFiltered && (
          <Button variant="ghost" onClick={() => reset()} className="h-8 px-2 lg:px-3">
            پاک کردن فیلترها
            <X className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
