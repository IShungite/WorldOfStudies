export class PaginationRequest {
  readonly page: number
  readonly perPage: number
  constructor({ page, perPage }: { page?: number; perPage?: number }) {
    this.page = page ?? 1
    this.perPage = perPage ?? 20
  }
}
