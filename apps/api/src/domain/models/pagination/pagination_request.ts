export class PaginationRequest {
  readonly page: number
  readonly limit: number
  constructor({ page, limit }: { page?: number; limit?: number }) {
    this.page = page ?? 1
    this.limit = limit ?? 20
  }
}
