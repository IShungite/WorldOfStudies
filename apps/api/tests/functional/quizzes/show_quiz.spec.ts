import { Quiz } from '#domainModels/quiz/quiz'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import { InMemoryQuizzesRepository } from '#repositories/in_memory_quizzes.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Quizzes - show', (group) => {
  let quizzesRepository: IQuizzesRepository

  group.each.setup(async () => {
    quizzesRepository = new InMemoryQuizzesRepository()
    app.container.swap(IQuizzesRepository, () => {
      return quizzesRepository
    })
  })

  test('It should return a quiz', async ({ client }) => {
    const quiz = new Quiz({ name: 'Quiz 1', questions: [] })
    quizzesRepository.save(quiz)

    const response = await client.get(`/quizzes/${quiz.id}`)

    response.assertStatus(StatusCodes.OK)
    response.assertBodyContains({ id: quiz.id, name: quiz.name, questions: [] })
  })

  test('It should return a 400 if the quiz does not exist', async ({ client }) => {
    const response = await client.get('/quizzes/1')
    response.assertStatus(StatusCodes.BAD_REQUEST)
  })
})
