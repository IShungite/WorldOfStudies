import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { IUserAnswersRepository } from '../../../src/quiz/domain/contracts/user_answers.repository.js'
import { QuestionQcm, questionType } from '../../../src/quiz/domain/models/quiz/question.js'
import { QuizFactory } from '../../../src/quiz/domain/factories/quiz.factory'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import { IQuizzesRepository } from '../../../src/quiz/domain/contracts/quizzes.repository.js'
import { IUsersRepository } from '../../../src/user/domain/contracts/repositories/users.repository.js'
import { ICharactersRepository } from '../../../src/character/domain/contracts/repositories/characters.repository.js'
import { Character } from '../../../src/character/domain/models/character.js'
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
