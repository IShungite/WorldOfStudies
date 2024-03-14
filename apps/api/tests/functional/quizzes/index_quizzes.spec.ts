import { Quiz } from '#domainModels/quiz/quiz'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import { InMemoryQuizzesRepository } from '#repositories/in_memory_quizzes.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Quizzes - index', (group) => {
  let quizzesRepository: IQuizzesRepository

  group.each.setup(async () => {
    quizzesRepository = new InMemoryQuizzesRepository()
    app.container.swap(IQuizzesRepository, () => {
      return quizzesRepository
    })
  })

  test('It should return the list of quizzes', async ({ client, assert }) => {
    quizzesRepository.save(new Quiz({ name: 'Quiz 1', questions: [] }))
    quizzesRepository.save(new Quiz({ name: 'Quiz 2', questions: [] }))

    const response = await client.get('/quizzes')
    response.assertStatus(StatusCodes.OK)
    assert.lengthOf(response.body(), 2)
    response.assertBodyContains([{ name: 'Quiz 1' }, { name: 'Quiz 2' }])
  })
})
