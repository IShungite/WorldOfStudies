import { Quiz } from '#domainModels/quiz/quiz'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Quizzes - show', (group) => {
  let quizzesRepository: IQuizzesRepository

  group.setup(async () => {
    quizzesRepository = await app.container.make(IQuizzesRepository)
  })

  group.each.setup(async () => {
    await quizzesRepository.empty()
  })

  test('It should return a quiz', async ({ client }) => {
    const quiz = new Quiz({ name: 'Quiz 1', questions: [] })
    await quizzesRepository.save(quiz)

    const response = await client.get(`/quizzes/${quiz.id}`)

    response.assertStatus(StatusCodes.OK)
    response.assertBodyContains({ id: quiz.id, name: quiz.name, questions: [] })
  })

  test('It should return a 400 if the quiz does not exist', async ({ client }) => {
    const response = await client.get('/quizzes/1')
    response.assertStatus(StatusCodes.BAD_REQUEST)
  })
})
