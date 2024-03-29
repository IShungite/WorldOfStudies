import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { IUserAnswersRepository } from '#domain/contracts/repositories/user_answers.repository'
import { QuestionQcm, questionType } from '#domain/models/quiz/question'
import { QuizFactory } from '#domain/factories/quiz.factory'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import { IQuizzesRepository } from '#domain/contracts/repositories/quizzes.repository'
import { IUsersRepository } from '#domain/contracts/repositories/users.repository'
import { ICharactersRepository } from '#domain/contracts/repositories/characters.repository'
import { Character } from '#domain/models/character/character'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'

test.group('User-answers - store', (group) => {
  let userAnswersRepository: IUserAnswersRepository
  let quizzesRepository: IQuizzesRepository
  let usersRepository: IUsersRepository
  let charactersRepository: ICharactersRepository

  group.setup(async () => {
    ;[userAnswersRepository, quizzesRepository, usersRepository, charactersRepository] =
      await createRepositories([
        IUserAnswersRepository,
        IQuizzesRepository,
        IUsersRepository,
        ICharactersRepository,
      ])
  })

  group.each.setup(async () => {
    await await emptyRepositories([
      userAnswersRepository,
      quizzesRepository,
      usersRepository,
      charactersRepository,
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
