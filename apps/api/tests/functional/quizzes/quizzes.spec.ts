import { Quiz } from '#domainModels/quiz/quiz'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import { InMemoryQuizzesRepository } from '#repositories/in_memory_quizzes.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'

test.group('Quizzes', (group) => {
  let quizzesRepository: IQuizzesRepository

  group.each.setup(async () => {
    quizzesRepository = new InMemoryQuizzesRepository()
    app.container.swap(IQuizzesRepository, () => {
      return quizzesRepository
    })
  })

  test('It should create a quiz', async ({ client }) => {
    const response = await client.post('/quizzes').json({
      name: 'Quiz 1',
      questions: [],
    })
    response.assertStatus(201)
    response.assertBodyContains({ name: 'Quiz 1' })
  })

  test('It should return the list of quizzes', async ({ client, assert }) => {
    quizzesRepository.save(new Quiz({ name: 'Quiz 1', questions: [] }))
    quizzesRepository.save(new Quiz({ name: 'Quiz 2', questions: [] }))

    const response = await client.get('/quizzes')
    response.assertStatus(200)
    assert.lengthOf(response.body(), 2)
  })
})
