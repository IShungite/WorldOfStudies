export class PaginatedData<T> {
  readonly results: T[]
  readonly totalResults: number
  readonly currentPage: number
  readonly totalPages: number
  readonly lastPage: number

  constructor({
    results,
    totalResults,
    currentPage,
    totalPages,
    lastPage,
  }: {
    results: T[]
    totalResults: number
    currentPage: number
    totalPages: number
    lastPage: number
  }) {
    this.results = results
    this.totalResults = totalResults
    this.currentPage = currentPage
    this.totalPages = totalPages
    this.lastPage = lastPage
  }
}
