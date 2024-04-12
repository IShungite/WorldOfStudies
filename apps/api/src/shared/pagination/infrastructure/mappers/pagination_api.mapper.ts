import { PaginatedData } from '#shared/pagination/domain/models/paginated_data'
import { getFullUrl } from '#shared/infra/api/utils/get_url'

export class PaginationApiMapper {
  static toResponse<T>(
    pagination: PaginatedData<T>,
    resultMapperCallback: (item: T) => any,
    url: string
  ) {
    return {
      results: pagination.results.map((result) => resultMapperCallback(result)),
      totalResults: pagination.totalResults,
      perPage: pagination.perPage,
      currentPage: pagination.currentPage,
      firstPage: pagination.firstPage,
      lastPage: pagination.lastPage,
      _links: this.getLinks(pagination, url),
    }
  }

  private static getLinks<T>(pagination: PaginatedData<T>, url: string) {
    const links: Record<string, string> = {
      first: getFullUrl(`${url}?page=${pagination.firstPage}&perPage=${pagination.perPage}`),
      last: getFullUrl(`${url}?page=${pagination.lastPage}&perPage=${pagination.perPage}`),
    }

    if (pagination.currentPage > pagination.firstPage) {
      links.prev = getFullUrl(
        `${url}?page=${pagination.currentPage - 1}&perPage=${pagination.perPage}`
      )
    }

    if (pagination.currentPage + 1 <= pagination.lastPage) {
      links.next = getFullUrl(
        `${url}?page=${pagination.currentPage + 1}&perPage=${pagination.perPage}`
      )
    }

    return links
  }
}
