import { Question, questionType } from '#domainModels/quiz/question'
import { Quiz } from '#domainModels/quiz/quiz'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import { QuestionFactory } from '#factories/question.factory'
import { InMemoryQuizzesRepository } from '#repositories/in_memory_quizzes.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('Quizzes - update', (group) => {
  let quizzesRepository: IQuizzesRepository

  group.each.setup(async () => {
    quizzesRepository = new InMemoryQuizzesRepository()
    app.container.swap(IQuizzesRepository, () => {
      return quizzesRepository
    })
  })

  test('It should return a 400 if the quiz does not exist', async ({ client }) => {
    const response = await client.patch('/quizzes/1').json({})
    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should update the name of a quiz', async ({ client }) => {
    const quiz = new Quiz({ name: 'Quiz 1', questions: [] })
    quizzesRepository.save(quiz)

    const response = await client.patch(`/quizzes/${quiz.id}`).json({ name: 'Quiz 2' })

    response.assertStatus(StatusCodes.OK)
    response.assertBodyContains({ name: 'Quiz 2' })
  })

  test('It should update the questions of a quiz', async ({ client }) => {
    const question = QuestionFactory.create({ type: questionType.QCM, points: 1, choices: [] })
    const quiz = new Quiz({ name: 'Quiz 1', questions: [question] })
    quizzesRepository.save(quiz)

    const newQuestion = { ...question, points: 2, id: question.id.toString() }

    const response = await client.patch(`/quizzes/${quiz.id}`).json({ questions: [newQuestion] })

    response.assertBodyContains({ questions: [newQuestion] })
  })
})
