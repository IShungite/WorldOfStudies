import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { IUserAnswersRepository } from '#domainPorts/out/user_answers.repository'
import { QuestionQcm, questionType } from '#domainModels/quiz/question'
import { QuizFactory } from '#factories/quiz.factory'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import { IUsersRepository } from '#domainPorts/out/users.repository'
import { ICharactersRepository } from '#domainPorts/out/characters.repository'
import { Character } from '#domainModels/character/character'

test.group('User-answers - store', (group) => {
  let userAnswersRepository: IUserAnswersRepository
  let quizzesRepository: IQuizzesRepository
  let usersRepository: IUsersRepository
  let charactersRepository: ICharactersRepository

  group.setup(async () => {
    ;[userAnswersRepository, quizzesRepository, usersRepository, charactersRepository] =
      await Promise.all([
        app.container.make(IUserAnswersRepository),
        app.container.make(IQuizzesRepository),
        app.container.make(IUsersRepository),
        app.container.make(ICharactersRepository),
      ])
  })

  group.each.setup(async () => {
    await Promise.all([
      userAnswersRepository.empty(),
      quizzesRepository.empty(),
      usersRepository.empty(),
      charactersRepository.empty(),
    ])
  })

  test('It should return a 422 if the payload is invalid', async ({ client }) => {
    const response = await client.post('/user-answers').json({})

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should create a user-answer of type QCM', async ({ client }) => {
    const user = new UserBuilderTest().build()
    const character = new Character({ name: 'test', userId: user.id })
    const quiz = QuizFactory.create({
      name: 'Quiz 1',
      questions: [
        {
          type: questionType.QCM,
          points: 1,
          choices: [
            { isCorrect: true, label: 'Choice 1' },
            { isCorrect: false, label: 'Choice 2' },
          ],
        },
      ],
    })

    await Promise.all([usersRepository.save(user), quizzesRepository.save(quiz)])
    await charactersRepository.save(character)

    const question = quiz.questions[0] as QuestionQcm

    const payload = {
      type: questionType.QCM,
      questionId: question.id.toString(),
      choiceId: question.choices[0].id.toString(),
      characterId: character.id.toString(),
    }

    const response = await client.post('/user-answers').json(payload)

    response.assertStatus(StatusCodes.CREATED)
    response.assertBodyContains({
      type: questionType.QCM,
      questionId: payload.questionId,
      characterId: payload.characterId,
    })
  })
})
