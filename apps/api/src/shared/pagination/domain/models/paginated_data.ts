export class PaginatedData<T> {
  readonly results: T[]
  readonly totalResults: number
  readonly perPage: number
  readonly currentPage: number
  readonly firstPage: number
  readonly lastPage: number

  constructor({
    results,
    totalResults,
    perPage,
    currentPage,
    firstPage,
    lastPage,
  }: {
    results: T[]
    totalResults: number
    perPage: number
    currentPage: number
    firstPage: number
    lastPage: number
  }) {
    this.results = results
    this.totalResults = totalResults
    this.currentPage = currentPage
    this.perPage = perPage
    this.firstPage = firstPage
    this.lastPage = lastPage
  }
}
