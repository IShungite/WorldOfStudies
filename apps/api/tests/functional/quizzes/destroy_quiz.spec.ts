import { Quiz } from '#domainModels/quiz/quiz'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import { InMemoryQuizzesRepository } from '#repositories/in_memory_quizzes.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Quizzes - destroy', (group) => {
  let quizzesRepository: IQuizzesRepository

  group.each.setup(async () => {
    quizzesRepository = new InMemoryQuizzesRepository()
    app.container.swap(IQuizzesRepository, () => {
      return quizzesRepository
    })
  })

  test('It should return a 400 if the quiz does not exist', async ({ client }) => {
    const quiz = new Quiz({ name: 'Quiz 1', questions: [] })

    const response = await client.delete(`/quizzes/${quiz.id.toString() + 1}`)
    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should return a 204 if the quiz exists and is deleted', async ({ client, assert }) => {
    const quiz = new Quiz({ name: 'Quiz 1', questions: [] })
    quizzesRepository.save(quiz)

    const response = await client.delete(`/quizzes/${quiz.id.toString()}`)
    response.assertStatus(StatusCodes.NO_CONTENT)

    const deletedQuiz = await quizzesRepository.getById(quiz.id)
    assert.isNull(deletedQuiz)
  })
})
