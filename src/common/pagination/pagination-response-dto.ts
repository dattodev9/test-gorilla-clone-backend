export class PaginationResponseDto<T> {
  data: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}
