import { Assert } from '@japa/assert'
import {
  currentPageDefault,
  perPageDefault,
} from '../../src/shared/pagination/domain/models/pagination_request.js'

export default function assertPaginatedResponse(
  assert: Assert,
  body: any,
  expected: {
    totalResults: number
    results?: any[]
    perPage?: number
    currentPage?: number
    firstPage?: number
    lastPage?: number
    resultsLength: number
  }
) {
  assert.equal(body.totalResults, expected.totalResults)
  assert.equal(body.perPage, expected.perPage ?? perPageDefault)
  assert.equal(body.currentPage, expected.currentPage ?? currentPageDefault)
  assert.equal(body.firstPage, expected.firstPage ?? 1)
  assert.equal(body.lastPage, expected.lastPage ?? 1)

  assert.lengthOf(body.results, expected.resultsLength)

  if (expected.results) {
    assert.containsSubset(body.results, expected.results)
  }
}
