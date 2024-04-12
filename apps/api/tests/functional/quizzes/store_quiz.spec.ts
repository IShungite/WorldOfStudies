import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'

test.group('Quizzes - store', (group) => {
  let quizzesRepository: IQuizzesRepository

  group.setup(async () => {
    ;[quizzesRepository] = await createRepositories([IQuizzesRepository])
  })

  group.each.setup(async () => {
    await emptyRepositories([quizzesRepository])
  })

  test('It should create a quiz', async ({ client }) => {
    const response = await client.post('/quizzes').json({
      name: 'Quiz 1',
      questions: [],
    })
    response.assertStatus(StatusCodes.CREATED)
    response.assertBodyContains({ result: { name: 'Quiz 1' } })
  })

  test('It should return a 422 if the payload is invalid')
    .with([{ name: 'Quiz 1' }, { questions: [] }])
    .run(async ({ client }, payload) => {
      const response = await client.post('/quizzes').json(payload)
      response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
    })
})
