import { Assert } from '@japa/assert'

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
  assert.equal(body.totalResults, expected.totalResults ?? 2)
  assert.equal(body.perPage, expected.perPage ?? 20)
  assert.equal(body.currentPage, expected.currentPage ?? 1)
  assert.equal(body.firstPage, expected.firstPage ?? 1)
  assert.equal(body.lastPage, expected.lastPage ?? 1)

  assert.lengthOf(body.results, expected.resultsLength)

  if (expected.results) {
    assert.containsSubset(body.results, expected.results)
  }
}
