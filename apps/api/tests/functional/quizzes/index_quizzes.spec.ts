import { Quiz } from '#domain/models/quiz/quiz'
import { IQuizzesRepository } from '#domain/contracts/repositories/quizzes.repository'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'

test.group('Quizzes - index', (group) => {
  let quizzesRepository: IQuizzesRepository

  group.setup(async () => {
    ;[quizzesRepository] = await createRepositories([IQuizzesRepository])
  })

  group.each.setup(async () => {
    await emptyRepositories([quizzesRepository])
  })

  test('It should return the list of quizzes', async ({ client, assert }) => {
    await Promise.all([
      quizzesRepository.save(new Quiz({ name: 'Quiz 1', questions: [] })),
      quizzesRepository.save(new Quiz({ name: 'Quiz 2', questions: [] })),
    ])

    const response = await client.get('/quizzes')

    response.assertStatus(StatusCodes.OK)
    assert.lengthOf(response.body(), 2)
    response.assertBodyContains([{ name: 'Quiz 1' }, { name: 'Quiz 2' }])
  })
})
