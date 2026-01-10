import type { ReactNode } from "react";

// ============================================
// Core Filter Value Types
// ============================================

export type FilterValue = string | string[] | number | number[] | [number, number] | Date | [Date, Date] | undefined;

export type FilterState = Record<string, FilterValue>;

// ============================================
// Sort Configuration
// ============================================

export type SortOption = {
  readonly value: string;
  readonly label: string;
  readonly icon?: ReactNode;
};

export type SortConfig = {
  readonly key: string;
  readonly options: readonly SortOption[];
  readonly defaultValue?: string;
};

// ============================================
// Search Configuration
// ============================================

export type SearchConfig = {
  readonly key: string;
  readonly placeholder: string;
};

// ============================================
// Filter Field Types
// ============================================

type FilterFieldBase = {
  readonly key: string;
  readonly label: string;
  readonly icon?: ReactNode;
  readonly description?: string;
};

export type MultiSelectOption = {
  readonly value: string;
  readonly label: string;
  readonly icon?: ReactNode;
  readonly count?: number;
};

export type MultiSelectFilterField = FilterFieldBase & {
  readonly type: "multi-select";
  readonly options: readonly MultiSelectOption[];
  readonly searchable?: boolean;
  readonly searchPlaceholder?: string;
  readonly asPills?: boolean;
};

export type RadioFilterField = FilterFieldBase & {
  readonly type: "radio";
  readonly options: readonly MultiSelectOption[];
  readonly showAll?: boolean;
  readonly allLabel?: string;
};

export type RangeFilterField = FilterFieldBase & {
  readonly type: "range";
  readonly min: number;
  readonly max: number;
  readonly step?: number;
  readonly formatValue?: (value: number) => string;
  readonly histogram?: readonly number[];
};

export type DateRangeFilterField = FilterFieldBase & {
  readonly type: "date-range";
  readonly minDate?: Date;
  readonly maxDate?: Date;
  readonly presets?: readonly { readonly label: string; readonly range: [Date, Date] }[];
};

export type FilterField = MultiSelectFilterField | RadioFilterField | RangeFilterField | DateRangeFilterField;

// ============================================
// Entity Filter Configuration
// ============================================

export type EntityFilterConfig<TFilters extends FilterState = FilterState> = {
  readonly title: string;
  readonly description?: string;
  readonly search?: SearchConfig;
  readonly sort?: SortConfig;
  readonly filters: readonly FilterField[];
  readonly defaultFilters: TFilters;
};

// ============================================
// Mobile View State
// ============================================

export type MobileFilterView = "categories" | { readonly type: "detail"; readonly fieldKey: string };

// ============================================
// Helper type for extracting filter keys
// ============================================

export type FilterKeys<T extends FilterState> = keyof T & string;
