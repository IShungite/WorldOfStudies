import { Quiz } from '#quiz/domain/models/quiz/quiz'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { IQuizzesGameRepository } from '#quiz/domain/contracts/quizzes_game.repository'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import { CharacterBuilderTest } from '#tests/builders/character_builder_test'
import { SchoolBuilderTest } from '#tests/builders/school_builder_test'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { QuizGame } from '#quiz/domain/models/quiz/quiz_game'
import { QuizGameAlreadyStartedException } from '#quiz/domain/models/quiz/exceptions/quiz_game_already_started.exception'

test.group('Quizzes - show', (group) => {
  let quizzesRepository: IQuizzesRepository
  let quizzesGameRepository: IQuizzesGameRepository
  let usersRepository: IUsersRepository
  let schoolsRepository: ISchoolsRepository
  let charactersRepository: ICharactersRepository

  group.setup(async () => {
    ;[
      quizzesRepository,
      quizzesGameRepository,
      usersRepository,
      schoolsRepository,
      charactersRepository,
    ] = await createRepositories([
      IQuizzesRepository,
      IQuizzesGameRepository,
      IUsersRepository,
      ISchoolsRepository,
      ICharactersRepository,
    ])
  })

  group.each.setup(async () => {
    await emptyRepositories([
      quizzesRepository,
      quizzesGameRepository,
      usersRepository,
      schoolsRepository,
      charactersRepository,
    ])
  })

  test('It should return a 422 if the payload is invalid', async ({ client }) => {
    const user = new UserBuilderTest().build()
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 1).build()
    const character = new CharacterBuilderTest()
      .withUser(user)
      .withPromotionId(school.promotions[0])
      .build()
    const quiz = new Quiz({ name: 'Quiz 1', questions: [] })

    await Promise.all([
      quizzesRepository.save(quiz),
      usersRepository.save(user),
      schoolsRepository.save(school),
    ])
    await charactersRepository.save(character)

    const response = await client
      .post(`/quizzes/${quiz.id.toString()}/start`)
      .json({})
      .loginWith(user)

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should return a 400 if the quiz is already started', async ({ client }) => {
    const user = new UserBuilderTest().build()
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 1).build()
    const character = new CharacterBuilderTest()
      .withUser(user)
      .withPromotionId(school.promotions[0])
      .build()
    const quiz = new Quiz({ name: 'Quiz 1', questions: [] })
    const quizGame = new QuizGame({
      quiz,
      characterId: character.id,
    })

    await Promise.all([
      quizzesRepository.save(quiz),
      usersRepository.save(user),
      schoolsRepository.save(school),
    ])
    await Promise.all([charactersRepository.save(character), quizzesGameRepository.save(quizGame)])

    const response = await client
      .post(`/quizzes/${quiz.id.toString()}/start`)
      .json({
        characterId: character.id.toString(),
      })
      .loginWith(user)

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new QuizGameAlreadyStartedException(quiz.id).message)
  })

  test('It should start a quiz', async ({ client, assert }) => {
    const user = new UserBuilderTest().build()
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 1).build()
    const character = new CharacterBuilderTest()
      .withUser(user)
      .withPromotionId(school.promotions[0])
      .build()
    const quiz = new Quiz({ name: 'Quiz 1', questions: [] })

    await Promise.all([
      quizzesRepository.save(quiz),
      usersRepository.save(user),
      schoolsRepository.save(school),
    ])
    await charactersRepository.save(character)

    const response = await client
      .post(`/quizzes/${quiz.id.toString()}/start`)
      .json({
        characterId: character.id.toString(),
      })
      .loginWith(user)

    response.assertStatus(StatusCodes.OK)
    assert.containsSubset(response.body().result, {
      quizId: quiz.id.toString(),
      characterId: character.id.toString(),
    })
    const quizGame = await quizzesGameRepository.getByQuizIdAndCharacterId(quiz.id, character.id)
    assert.isNotNull(quizGame)
  })
})
