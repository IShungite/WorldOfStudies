import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Quizzes - store', (group) => {
  let quizzesRepository: IQuizzesRepository

  group.setup(async () => {
    quizzesRepository = await app.container.make(IQuizzesRepository)
  })

  group.each.setup(async () => {
    await quizzesRepository.empty()
  })

  test('It should create a quiz', async ({ client }) => {
    const response = await client.post('/quizzes').json({
      name: 'Quiz 1',
      questions: [],
    })
    response.assertStatus(StatusCodes.CREATED)
    response.assertBodyContains({ name: 'Quiz 1' })
  })

  test('It should return a 422 if the payload is invalid')
    .with([{ name: 'Quiz 1' }, { questions: [] }])
    .run(async ({ client }, payload) => {
      const response = await client.post('/quizzes').json(payload)
      response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
    })
})
