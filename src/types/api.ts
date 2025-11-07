export interface ProblemDetails {
  type: string;
  title: string;
  detail?: string;
  instance?: string;
  extensions?: Record<string, string>;
  statusCode: number;
  occuredAt: Date;
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

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}
