import { Quiz } from '#domainModels/quiz/quiz'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Quizzes - destroy', (group) => {
  let quizzesRepository: IQuizzesRepository

  group.setup(async () => {
    quizzesRepository = await app.container.make(IQuizzesRepository)
  })

  group.each.setup(async () => {
    await quizzesRepository.empty()
  })

  test('It should return a 400 if the quiz does not exist', async ({ client }) => {
    const quiz = new Quiz({ name: 'Quiz 1', questions: [] })

    const response = await client.delete(`/quizzes/${quiz.id.toString() + 1}`)
    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should return a 204 if the quiz exists and is deleted', async ({ client, assert }) => {
    const quiz = new Quiz({ name: 'Quiz 1', questions: [] })
    await quizzesRepository.save(quiz)

    const response = await client.delete(`/quizzes/${quiz.id.toString()}`)
    const deletedQuiz = await quizzesRepository.getById(quiz.id)

    response.assertStatus(StatusCodes.NO_CONTENT)
    assert.isNull(deletedQuiz)
  })
})
