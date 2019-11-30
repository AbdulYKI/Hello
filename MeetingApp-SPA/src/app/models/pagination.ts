export interface Pagination {
  pageSize: number;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export class PaginationResult<T> {
  result: T;
  pagination: Pagination;
}
