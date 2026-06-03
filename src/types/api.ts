export enum OrderDirection {
  ASC = "asc",
  DESC = "desc"
}

export type IsoDateString = string;

export type ProblemDetailsExtensions = Record<string, unknown>;

export interface ProblemDetails {
  type: string;
  title: string;
  detail?: string;
  instance?: string;
  extensions?: ProblemDetailsExtensions;
  statusCode: number;
  occurredAt?: IsoDateString;
  occuredAt?: IsoDateString;
  // errors?: Array<{ field: string; message: string }>; Add later
}

export interface PageMetaDto {
  totalItems: number;
  itemCount: number;
  page: number; // 1-based
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PageLinksDto {
  self: string;
  first: string;
  last: string;
  prev?: string;
  next?: string;
}

export interface PaginatedResponseDto<T> {
  data: T[];
  meta: PageMetaDto;
  links?: PageLinksDto;
}

export interface SortParams {
  orderBy?: string;
  orderDir?: OrderDirection;
}

export interface CreatedAtRangeParams {
  minCreatedAt?: IsoDateString;
  maxCreatedAt?: IsoDateString;
}

export interface UpdatedAtRangeParams {
  minUpdatedAt?: IsoDateString;
  maxUpdatedAt?: IsoDateString;
}

export interface PaginationParams extends SortParams, CreatedAtRangeParams, UpdatedAtRangeParams {
  page?: number;
  pageSize?: number;
  search?: string;
}
