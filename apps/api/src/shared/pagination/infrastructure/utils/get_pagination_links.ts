import { getUrl } from '#shared/infra/api/utils/get_url'
import { PaginatedData } from '#shared/pagination/domain/models/paginated_data'

export default function getPaginationLinks<T>(url: string, pagination: PaginatedData<T>) {
  const links: { first: string; last: string; prev?: string; next?: string } = {
    first: getUrl(`${url}?page=${pagination.firstPage}&perPage=${pagination.perPage}`),
    last: getUrl(`${url}?page=${pagination.lastPage}&perPage=${pagination.perPage}`),
  }

  if (pagination.currentPage > pagination.firstPage) {
    links.prev = getUrl(`${url}?page=${pagination.currentPage - 1}&perPage=${pagination.perPage}`)
  }

  if (pagination.currentPage + 1 <= pagination.lastPage) {
    links.next = getUrl(`${url}?page=${pagination.currentPage + 1}&perPage=${pagination.perPage}`)
  }

  return links
}
