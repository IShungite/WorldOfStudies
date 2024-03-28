import { questionType } from '#domain/models/quiz/question'
import { Quiz } from '#domain/models/quiz/quiz'
import { IQuizzesRepository } from '#domain/contracts/repositories/quizzes.repository'
import { QuestionFactory } from '#domain/factories/question.factory'
import { QuizMapper } from '#infrastructure/mappers/quiz.mapper'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Quizzes - update', (group) => {
  let quizzesRepository: IQuizzesRepository

  group.setup(async () => {
    quizzesRepository = await app.container.make(IQuizzesRepository)
  })

  group.each.setup(async () => {
    await quizzesRepository.empty()
  })

  test('It should return a 400 if the quiz does not exist', async ({ client }) => {
    const response = await client.patch('/quizzes/1').json({})
    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should update the name of a quiz', async ({ client }) => {
    const quiz = new Quiz({ name: 'Quiz 1', questions: [] })
    await quizzesRepository.save(quiz)

    const response = await client.patch(`/quizzes/${quiz.id}`).json({ name: 'Quiz 2' })

    response.assertStatus(StatusCodes.OK)
    response.assertBodyContains({ name: 'Quiz 2' })
  })

  test('It should return a 422 if the payload is invalid', async ({ client }) => {
    const quiz = new Quiz({ name: 'Quiz 1', questions: [] })
    await quizzesRepository.save(quiz)

    const response = await client.patch(`/quizzes/${quiz.id}`).json({
      name: 15,
    })

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should return a 200 and update the questions of a quiz', async ({ client }) => {
    const question = QuestionFactory.create({
      type: questionType.QCM,
      points: 1,
      choices: [
        { isCorrect: true, label: 'Choice 1' },
        { isCorrect: false, label: 'Choice 2' },
      ],
    })
    const quiz = new Quiz({ name: 'Quiz 1', questions: [question] })
    await quizzesRepository.save(quiz)

    const updatedQuestion = QuestionFactory.create({
      id: question.id,
      type: questionType.QCM,
      points: 2,
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
    response.assertBodyContains(QuizMapper.toResponse(expectedQuiz))
  })
})
