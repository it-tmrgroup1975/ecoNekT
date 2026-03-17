// src/types/table.ts
export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface PaginatedData<T> {
  count: number;
  results: T[];
  next: string | null;
  previous: string | null;
}