import { Quiz } from '#quiz/domain/models/quiz/quiz'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { getFullUrl } from '#shared/infra/api/utils/get_url'
import { ISubjectsRepository } from '#school/domain/contracts/repositories/subjects.repository'
import { SubjectBuilderTest } from '#tests/builders/subject_builder_test'

test.group('Quizzes - show', (group) => {
  let quizzesRepository: IQuizzesRepository
  let subjectsRepository: ISubjectsRepository

  group.setup(async () => {
    ;[quizzesRepository, subjectsRepository] = await createRepositories([
      IQuizzesRepository,
      ISubjectsRepository,
    ])
  })

  group.each.setup(async () => {
    await emptyRepositories([quizzesRepository])
  })

  test('It should return a quiz', async ({ client }) => {
    const subject = new SubjectBuilderTest().build()
    const quiz = new Quiz({ name: 'Quiz 1', questions: [], subjectId: subject.id })
    await subjectsRepository.save(subject)
    await quizzesRepository.save(quiz)

    const response = await client.get(`/quizzes/${quiz.id}`)

    response.assertStatus(StatusCodes.OK)
    response.assertBodyContains({
      result: { id: quiz.id.toString(), name: quiz.name, questions: [] },
    })
  })

  test('It should return the link of the user answers', async ({ client }) => {
    const subject = new SubjectBuilderTest().build()
    const quiz = new Quiz({ name: 'Quiz 1', questions: [], subjectId: subject.id })
    await subjectsRepository.save(subject)
    await quizzesRepository.save(quiz)

    const response = await client.get(`/quizzes/${quiz.id}`)

    response.assertBodyContains({
      _links: {
        userAnswers: getFullUrl(`/api/quizzes/${quiz.id.toString()}/user-answers`),
      },
    })
  })

  test('It should return a 400 if the quiz does not exist', async ({ client }) => {
    const response = await client.get('/quizzes/1')
    response.assertStatus(StatusCodes.BAD_REQUEST)
  })
})
