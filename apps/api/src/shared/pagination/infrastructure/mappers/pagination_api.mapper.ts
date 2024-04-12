import { PaginatedData } from '#shared/pagination/domain/models/paginated_data'

export class PaginationApiMapper {
  static toResponse<T>(pagination: PaginatedData<T>, resultMapperCallback: (item: T) => any) {
    return {
      results: pagination.results.map((result) => resultMapperCallback(result)),
      totalResults: pagination.totalResults,
      perPage: pagination.perPage,
      currentPage: pagination.currentPage,
      firstPage: pagination.firstPage,
      lastPage: pagination.lastPage,
    }
  }
}
