export type PaginatedResponse<T> = {
  results: T[]
  totalResults: number
  perPage: number
  currentPage: number
  firstPage: number
  lastPage: number
}
