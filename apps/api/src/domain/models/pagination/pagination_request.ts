export const perPageDefault = 20
export const currentPageDefault = 1

export class PaginationRequest {
  readonly page: number
  readonly perPage: number
  constructor({ page, perPage }: { page?: number; perPage?: number }) {
    this.page = page ?? currentPageDefault
    this.perPage = perPage ?? perPageDefault
  }
}
