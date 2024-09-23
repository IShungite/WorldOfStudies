import { Quiz, QuizType } from '#quiz/domain/models/quiz/quiz'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import assertPaginatedResponse from '#tests/utils/assert_paginated_response'
import { Id } from '#shared/id/domain/models/id'
import { getFullUrl } from '#shared/infra/api/utils/get_url'
import { ISubjectsRepository } from '#school/domain/contracts/repositories/subjects.repository'
import { SubjectBuilderTest } from '#tests/builders/subject_builder_test'
import { Subject } from '#school/domain/models/subject'
import { PracticeQuiz } from '#quiz/domain/models/quiz/practice_quiz'
import { ExamQuiz } from '#quiz/domain/models/quiz/exam_quiz'

test.group('Quizzes - index', (group) => {
  let quizzesRepository: IQuizzesRepository
  let subjectsRepository: ISubjectsRepository

  let subject: Subject

  group.setup(async () => {
    ;[quizzesRepository, subjectsRepository] = await createRepositories([
      IQuizzesRepository,
      ISubjectsRepository,
    ])
  })

  group.each.setup(async () => {
    await emptyRepositories([quizzesRepository, subjectsRepository])

    subject = await subjectsRepository.save(new SubjectBuilderTest().build())
  })

  test('It should return the list of paginated practice quizzes', async ({ client, assert }) => {
    await Promise.all([
      quizzesRepository.save(
        new PracticeQuiz({ id: new Id('1'), name: 'Quiz 1', questions: [], subjectId: subject.id })
      ),
      quizzesRepository.save(
        new PracticeQuiz({ id: new Id('2'), name: 'Quiz 2', questions: [], subjectId: subject.id })
      ),
      quizzesRepository.save(
        new ExamQuiz({
          id: new Id('3'),
          name: 'Quiz 3',
          questions: [],
          subjectId: subject.id,
          startAt: new Date(),
          endAt: new Date(),
        })
      ),
    ])

    const response = await client.get('/quizzes')

    response.assertStatus(StatusCodes.OK)

    const body = await response.body()

    assertPaginatedResponse(assert, body, {
      results: [{ result: { name: 'Quiz 1' } }, { result: { name: 'Quiz 2' } }],
      totalResults: 2,
      resultsLength: 2,
    })
  })

  test('It should return the good amount of results if we provied a perPage parameter', async ({
    client,
    assert,
  }) => {
    await Promise.all([
      quizzesRepository.save(
        new Quiz({ id: new Id('1'), name: 'Quiz 1', questions: [], subjectId: subject.id })
      ),
      quizzesRepository.save(
        new Quiz({ id: new Id('2'), name: 'Quiz 2', questions: [], subjectId: subject.id })
      ),
    ])
    const perPage = 1

    const response = await client.get(`/quizzes?perPage=${perPage}`)

    response.assertStatus(StatusCodes.OK)

    const body = await response.body()

    assertPaginatedResponse(assert, body, {
      results: [{ result: { name: 'Quiz 1' } }],
      totalResults: 2,
      resultsLength: 1,
      lastPage: 2,
      perPage,
    })
  })

  test('It should return the good page if a page is provided', async ({ client, assert }) => {
    await Promise.all([
      quizzesRepository.save(
        new Quiz({ id: new Id('1'), name: 'Quiz 1', questions: [], subjectId: subject.id })
      ),
      quizzesRepository.save(
        new Quiz({ id: new Id('2'), name: 'Quiz 2', questions: [], subjectId: subject.id })
      ),
    ])
    const perPage = 1
    const page = 2

    const response = await client.get(`/quizzes?perPage=${perPage}&page=${page}`)

    response.assertStatus(StatusCodes.OK)

    const body = await response.body()

    assertPaginatedResponse(assert, body, {
      results: [{ result: { name: 'Quiz 2' } }],
      totalResults: 2,
      resultsLength: 1,
      currentPage: page,
      lastPage: 2,
      perPage,
    })
  })

  test('It should return the good links if we are on the first page', async ({ client }) => {
    await Promise.all([
      quizzesRepository.save(
        new Quiz({ id: new Id('1'), name: 'Quiz 1', questions: [], subjectId: subject.id })
      ),
      quizzesRepository.save(
        new Quiz({ id: new Id('2'), name: 'Quiz 2', questions: [], subjectId: subject.id })
      ),
    ])
    const perPage = 1
    const page = 1

    const response = await client.get(`/quizzes?perPage=${perPage}&page=${page}`)

    response.assertStatus(StatusCodes.OK)

    response.assertBodyContains({
      _links: {
        first: getFullUrl(`/api/quizzes?page=1&perPage=${perPage}`),
        next: getFullUrl(`/api/quizzes?page=2&perPage=${perPage}`),
        last: getFullUrl(`/api/quizzes?page=2&perPage=${perPage}`),
      },
    })
  })

  test('It should return the good links if we are on the last page', async ({ client }) => {
    await Promise.all([
      quizzesRepository.save(
        new Quiz({ id: new Id('1'), name: 'Quiz 1', questions: [], subjectId: subject.id })
      ),
      quizzesRepository.save(
        new Quiz({ id: new Id('2'), name: 'Quiz 2', questions: [], subjectId: subject.id })
      ),
    ])
    const perPage = 1
    const page = 2

    const response = await client.get(`/quizzes?perPage=${perPage}&page=${page}`)

    response.assertStatus(StatusCodes.OK)

    response.assertBodyContains({
      _links: {
        first: getFullUrl(`/api/quizzes?page=1&perPage=${perPage}`),
        prev: getFullUrl(`/api/quizzes?page=1&perPage=${perPage}`),
        last: getFullUrl(`/api/quizzes?page=2&perPage=${perPage}`),
      },
    })
  })

  test('It should return only the exams quizzes', async ({ client, assert }) => {
    await Promise.all([
      quizzesRepository.save(
        new PracticeQuiz({ id: new Id('1'), name: 'Quiz 1', questions: [], subjectId: subject.id })
      ),
      quizzesRepository.save(
        new ExamQuiz({
          id: new Id('2'),
          name: 'Quiz 2',
          questions: [],
          subjectId: subject.id,
          startAt: new Date(),
          endAt: new Date(),
        })
      ),
    ])

    const response = await client.get(`/quizzes?type=${QuizType.EXAM}`)

    response.assertStatus(StatusCodes.OK)

    const body = response.body()

    assert.lengthOf(body.results, 1)
    assert.equal(body.results[0].result.id, '2')
  })
})
