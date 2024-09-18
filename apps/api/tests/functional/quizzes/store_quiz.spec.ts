import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { ISubjectsRepository } from '#school/domain/contracts/repositories/subjects.repository'
import { Subject } from '#school/domain/models/subject'

test.group('Quizzes - store', (group) => {
  let quizzesRepository: IQuizzesRepository
  let subjectsRepository: ISubjectsRepository

  group.setup(async () => {
    ;[quizzesRepository, subjectsRepository] = await createRepositories([
      IQuizzesRepository,
      ISubjectsRepository,
    ])
  })

  group.each.setup(async () => {
    await emptyRepositories([quizzesRepository, subjectsRepository])
  })

  test('It should create a quiz', async ({ client }) => {
    const subject = new Subject({ name: 'Math' })
    await subjectsRepository.save(subject)

    const response = await client.post('/quizzes').json({
      name: 'Quiz 1',
      questions: [],
      subjectId: subject.id.toString(),
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
