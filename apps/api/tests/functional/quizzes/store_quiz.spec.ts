import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { ISubjectsRepository } from '#school/domain/contracts/repositories/subjects.repository'
import { Subject } from '#school/domain/models/subject'
import { QuizType } from '#quiz/domain/models/quiz/quiz'

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

  test('It should create a quiz with exam type', async ({ client }) => {
    const subject = new Subject({ name: 'Math' })
    await subjectsRepository.save(subject)

    const startAt = new Date()
    const endAt = new Date(startAt.getTime() + 1000 * 60 * 60 * 2) // 2 hours

    const response = await client.post('/quizzes').json({
      name: 'Quiz 1',
      questions: [],
      subjectId: subject.id.toString(),
      type: QuizType.EXAM,
      startAt: startAt.toString(),
      endAt: endAt.toString(),
    })

    response.assertStatus(StatusCodes.CREATED)
    response.assertBodyContains({
      result: {
        name: 'Quiz 1',
        type: QuizType.EXAM,
        startAt: startAt.toString(),
        endAt: endAt.toString(),
      },
    })
  })

  test('It should create a quiz with practice type', async ({ client }) => {
    const subject = new Subject({ name: 'Math' })
    await subjectsRepository.save(subject)

    const response = await client.post('/quizzes').json({
      name: 'Quiz 1',
      questions: [],
      subjectId: subject.id.toString(),
      type: QuizType.PRACTICE,
    })

    response.assertStatus(StatusCodes.CREATED)
    response.assertBodyContains({
      result: { name: 'Quiz 1', type: QuizType.PRACTICE },
    })
  })

  test('It should return a 422 if the payload is invalid')
    .with([{ name: 'Quiz 1' }, { questions: [] }])
    .run(async ({ client }, payload) => {
      const response = await client.post('/quizzes').json(payload)
      response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
    })
})
