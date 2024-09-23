export interface PaginationAPIModel<T> {
  items: T[];
  currentPage: number;
  //pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  sortColumn: string;
  sortOrder: string;
  filterColumn: string;
  filterOrder: string;
}
