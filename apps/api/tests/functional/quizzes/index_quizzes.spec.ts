import { Quiz } from '#quiz/domain/models/quiz/quiz'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import assertPaginatedResponse from '#tests/utils/assert_paginated_response'
import { Id } from '#shared/id/domain/models/id'

test.group('Quizzes - index', (group) => {
  let quizzesRepository: IQuizzesRepository

  group.setup(async () => {
    ;[quizzesRepository] = await createRepositories([IQuizzesRepository])
  })

  group.each.setup(async () => {
    await emptyRepositories([quizzesRepository])
  })

  test('It should return the list of paginated quizzes', async ({ client, assert }) => {
    await Promise.all([
      quizzesRepository.save(new Quiz({ name: 'Quiz 1', questions: [] })),
      quizzesRepository.save(new Quiz({ name: 'Quiz 2', questions: [] })),
    ])

    const response = await client.get('/quizzes')

    response.assertStatus(StatusCodes.OK)

    const body = await response.body()

    assertPaginatedResponse(assert, body, {
      results: [{ name: 'Quiz 1' }, { name: 'Quiz 2' }],
      totalResults: 2,
      resultsLength: 2,
    })
  })

  test('It should return the good amount of results if we provied a perPage parameter', async ({
    client,
    assert,
  }) => {
    await Promise.all([
      quizzesRepository.save(new Quiz({ id: new Id('1'), name: 'Quiz 1', questions: [] })),
      quizzesRepository.save(new Quiz({ id: new Id('2'), name: 'Quiz 2', questions: [] })),
    ])
    const perPage = 1

    const response = await client.get(`/quizzes?perPage=${perPage}`)

    response.assertStatus(StatusCodes.OK)

    const body = await response.body()

    assertPaginatedResponse(assert, body, {
      results: [{ name: 'Quiz 1' }],
      totalResults: 2,
      resultsLength: 1,
      lastPage: 2,
      perPage,
    })
  })

  test('It should return the good page if a page is provided', async ({ client, assert }) => {
    await Promise.all([
      quizzesRepository.save(new Quiz({ id: new Id('1'), name: 'Quiz 1', questions: [] })),
      quizzesRepository.save(new Quiz({ id: new Id('2'), name: 'Quiz 2', questions: [] })),
    ])
    const perPage = 1
    const page = 2

    const response = await client.get(`/quizzes?perPage=${perPage}&page=${page}`)

    response.assertStatus(StatusCodes.OK)

    const body = await response.body()

    assertPaginatedResponse(assert, body, {
      results: [{ name: 'Quiz 2' }],
      totalResults: 2,
      resultsLength: 1,
      currentPage: page,
      lastPage: 2,
      perPage,
    })
  })
})
