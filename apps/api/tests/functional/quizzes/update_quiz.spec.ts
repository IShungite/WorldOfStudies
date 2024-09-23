import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { QuestionFactory } from '#quiz/domain/factories/question.factory'
import { Quiz } from '#quiz/domain/models/quiz/quiz'
import { ISubjectsRepository } from '#school/domain/contracts/repositories/subjects.repository'
import { Subject } from '#school/domain/models/subject'
import { SubjectBuilderTest } from '#tests/builders/subject_builder_test'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { test } from '@japa/runner'
import { QuestionType } from '#quiz/domain/models/quiz/question'
import { StatusCodes } from 'http-status-codes'

test.group('Quizzes - update', (group) => {
  let quizzesRepository: IQuizzesRepository
  let subjectsRepository: ISubjectsRepository

  let subject: Subject

  group.setup(async () => {
    ;[quizzesRepository, subjectsRepository] = await createRepositories([
      IQuizzesRepository,
      ISubjectsRepository,
    ])
  })

  group.each.setup(async () => {
    await emptyRepositories([quizzesRepository, subjectsRepository])

    subject = await subjectsRepository.save(new SubjectBuilderTest().build())
  })

  test('It should return a 400 if the quiz does not exist', async ({ client }) => {
    const response = await client.patch('/quizzes/1').json({})
    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should update the name of a quiz', async ({ client }) => {
    const quiz = new Quiz({ name: 'Quiz 1', questions: [], subjectId: subject.id })
    await quizzesRepository.save(quiz)

    const response = await client.patch(`/quizzes/${quiz.id}`).json({ name: 'Quiz 2' })

    response.assertStatus(StatusCodes.OK)
    response.assertBodyContains({ result: { name: 'Quiz 2' } })
  })

  test('It should return a 422 if the payload is invalid', async ({ client }) => {
    const quiz = new Quiz({ name: 'Quiz 1', questions: [], subjectId: subject.id })
    await quizzesRepository.save(quiz)

    const response = await client.patch(`/quizzes/${quiz.id}`).json({
      name: 15,
    })

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should return a 200 and update the questions of a quiz', async ({ client }) => {
    const question = QuestionFactory.create({
      type: QuestionType.QCM,
      points: 1,
      text: 'Question 1',
      choices: [
        { isCorrect: true, label: 'Choice 1' },
        { isCorrect: false, label: 'Choice 2' },
      ],
    })
    const quiz = new Quiz({ name: 'Quiz 1', questions: [question], subjectId: subject.id })
    await quizzesRepository.save(quiz)

    const updatedQuestion = QuestionFactory.create({
      id: question.id,
      type: QuestionType.QCM,
      points: 2,
      text: 'Updated question',
      choices: [
        { id: question.choices[0].id, isCorrect: true, label: 'Choice 11' },
        { id: question.choices[1].id, isCorrect: false, label: 'Choice 22' },
        { isCorrect: false, label: 'Choice 3' },
      ],
    })
    const updatedQuestionFormattedForRequest = {
      ...updatedQuestion,
      choices: updatedQuestion.choices.map((c) => {
        return {
          ...c,
          id: c.id.toString(),
        }
      }),
      id: updatedQuestion.id.toString(),
    }

    const response = await client.patch(`/quizzes/${quiz.id}`).json({
      questions: [updatedQuestionFormattedForRequest],
    })

    const expectedQuiz = new Quiz({
      ...quiz,
      questions: [updatedQuestion],
    })

    response.assertStatus(StatusCodes.OK)
    response.assertBodyContains({
      result: {
        id: expectedQuiz.id.toString(),
      },
    })
  })
})
