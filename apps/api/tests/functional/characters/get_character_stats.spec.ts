import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { CharacterNotFoundException } from '#character/domain/models/character_not_found.exception'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { IUserAnswersRepository } from '#quiz/domain/contracts/user_answers.repository'
import { QuizInstance } from '#quiz/domain/models/quiz/quiz_instance'
import { UserAnswerQcm, UserAnswerTextHole } from '#quiz/domain/models/user_answer/user_answer'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { ISubjectsRepository } from '#school/domain/contracts/repositories/subjects.repository'
import { Id } from '#shared/id/domain/models/id'
import { CharacterBuilderTest } from '#tests/builders/character_builder_test'
import { QuizBuilderTest } from '#tests/builders/quiz_builder_test'
import { SchoolBuilderTest } from '#tests/builders/school_builder_test'
import { SubjectBuilderTest } from '#tests/builders/subject_builder_test'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { test } from '@japa/runner'
import { CharacterStatsResponse } from '@world-of-studies/api-types'
import { StatusCodes } from 'http-status-codes'

test.group('Characters - characters by user', (group) => {
  let charactersRepository: ICharactersRepository
  let usersRepository: IUsersRepository
  let schoolsRepository: ISchoolsRepository
  let quizzesRepository: IQuizzesRepository
  let subjectsRepository: ISubjectsRepository
  let userAnswersRepository: IUserAnswersRepository
  let quizzesInstanceRepository: IQuizzesInstanceRepository

  group.setup(async () => {
    ;[
      charactersRepository,
      usersRepository,
      schoolsRepository,
      quizzesRepository,
      subjectsRepository,
      userAnswersRepository,
      quizzesInstanceRepository,
    ] = await createRepositories([
      ICharactersRepository,
      IUsersRepository,
      ISchoolsRepository,
      IQuizzesRepository,
      ISubjectsRepository,
      IUserAnswersRepository,
      IQuizzesInstanceRepository,
    ])
  })

  group.each.setup(async () => {
    await emptyRepositories([
      charactersRepository,
      usersRepository,
      schoolsRepository,
      quizzesRepository,
      subjectsRepository,
      userAnswersRepository,
      quizzesInstanceRepository,
    ])
  })

  test('It should return 401 when user is not authenticated', async ({ client }) => {
    const response = await client.get(`/characters/123/stats`)

    response.assertStatus(StatusCodes.UNAUTHORIZED)
    response.assertTextIncludes('Unauthorized access')
  })

  test('It should return a 400 when character does not exist', async ({ client }) => {
    const user = await usersRepository.save(new UserBuilderTest().build())

    const characterId = Id.factory()

    const response = await client.get(`/characters/${characterId}/stats`).loginWith(user)

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new CharacterNotFoundException(characterId).message)
  })

  test('It should return a 400 when character does not belong to the authenticated user', async ({
    client,
  }) => {
    const [user, user2, school] = await Promise.all([
      usersRepository.save(new UserBuilderTest().build()),
      usersRepository.save(new UserBuilderTest().build()),
      schoolsRepository.save(new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()),
    ])

    const character = await charactersRepository.save(
      new CharacterBuilderTest().withUser(user).withPromotion(school.promotions[0]).build()
    )

    const response = await client.get(`/characters/${character.id}/stats`).loginWith(user2)

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new CharacterNotFoundException(character.id).message)
  })

  test('It should return the character stats with no quizzes', async ({ client, assert }) => {
    const [user, school] = await Promise.all([
      usersRepository.save(new UserBuilderTest().build()),
      schoolsRepository.save(new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()),
    ])

    const character = await charactersRepository.save(
      new CharacterBuilderTest().withUser(user).withPromotion(school.promotions[0]).build()
    )

    const response = await client.get(`/characters/${character.id}/stats`).loginWith(user)

    response.assertStatus(StatusCodes.OK)
    const body: CharacterStatsResponse = response.body()
    const result = body.result
    assert.equal(result.generalAverage, 0)
    assert.equal(result.subjects.length, 0)
  })

  test('It should return the character stats with quizzes', async ({ client, assert }) => {
    const [user, subject1, subject2] = await Promise.all([
      usersRepository.save(new UserBuilderTest().build()),
      subjectsRepository.save(new SubjectBuilderTest().build()),
      subjectsRepository.save(new SubjectBuilderTest().withName('Science').build()),
    ])

    const school = await schoolsRepository.save(
      new SchoolBuilderTest()
        .withRandomPromotionsAndSubjects(1, 0)
        .withSubjects([subject1, subject2])
        .build()
    )

    const character = await charactersRepository.save(
      new CharacterBuilderTest().withUser(user).withPromotion(school.promotions[0]).build()
    )

    const [quiz1, quiz2, quiz3] = await Promise.all([
      quizzesRepository.save(
        new QuizBuilderTest().withName('Quiz 1').withSubject(subject1).build()
      ),
      quizzesRepository.save(
        new QuizBuilderTest().withName('Quiz 2').withSubject(subject2).build()
      ),
      quizzesRepository.save(
        new QuizBuilderTest().withName('Quiz 3').withSubject(subject2).build()
      ),
    ])
    const [quizInstance1, quizInstance2, quizInstance3] = await Promise.all([
      quizzesInstanceRepository.save(
        new QuizInstance({
          characterId: character.id,
          quiz: quiz1,
          userAnswers: [],
        })
      ),
      quizzesInstanceRepository.save(
        new QuizInstance({
          characterId: character.id,
          quiz: quiz2,
          userAnswers: [],
        })
      ),
      quizzesInstanceRepository.save(
        new QuizInstance({
          characterId: character.id,
          quiz: quiz3,
          userAnswers: [],
        })
      ),
    ])
    await Promise.all([
      // Quiz 1
      userAnswersRepository.save(
        new UserAnswerQcm({
          characterId: character.id,
          questionId: quiz1.questions[0].id,
          choiceId: quiz1.questions[0].choices[0].id,
          quizInstanceId: quizInstance1.id,
        })
      ),
      userAnswersRepository.save(
        new UserAnswerQcm({
          characterId: character.id,
          questionId: quiz1.questions[1].id,
          choiceId: quiz1.questions[1].choices[1].id,
          quizInstanceId: quizInstance1.id,
        })
      ),
      userAnswersRepository.save(
        new UserAnswerTextHole({
          characterId: character.id,
          questionId: quiz1.questions[2].id,
          quizInstanceId: quizInstance1.id,
          values: ['Paris'],
        })
      ),

      // Quiz 2
      userAnswersRepository.save(
        new UserAnswerQcm({
          characterId: character.id,
          questionId: quiz2.questions[0].id,
          choiceId: quiz2.questions[0].choices[1].id,
          quizInstanceId: quizInstance2.id,
        })
      ),
      userAnswersRepository.save(
        new UserAnswerQcm({
          characterId: character.id,
          questionId: quiz2.questions[1].id,
          choiceId: quiz2.questions[1].choices[0].id,
          quizInstanceId: quizInstance2.id,
        })
      ),
      userAnswersRepository.save(
        new UserAnswerTextHole({
          characterId: character.id,
          questionId: quiz2.questions[2].id,
          quizInstanceId: quizInstance2.id,
          values: ['aaaa'],
        })
      ),

      // Quiz 3
      userAnswersRepository.save(
        new UserAnswerQcm({
          characterId: character.id,
          questionId: quiz3.questions[0].id,
          choiceId: quiz3.questions[0].choices[0].id,
          quizInstanceId: quizInstance3.id,
        })
      ),
      userAnswersRepository.save(
        new UserAnswerQcm({
          characterId: character.id,
          questionId: quiz3.questions[1].id,
          choiceId: quiz3.questions[1].choices[1].id,
          quizInstanceId: quizInstance3.id,
        })
      ),
      userAnswersRepository.save(
        new UserAnswerTextHole({
          characterId: character.id,
          questionId: quiz3.questions[2].id,
          quizInstanceId: quizInstance3.id,
          values: ['Paris'],
        })
      ),
    ])

    const response = await client.get(`/characters/${character.id}/stats`).loginWith(user)

    response.assertStatus(StatusCodes.OK)
    const body: CharacterStatsResponse = response.body()
    const result = body.result
    assert.equal(result.subjects.length, 2)
    assert.equal(result.subjects.find((subject) => subject.name === subject1.name)?.average, 20)
    assert.equal(result.subjects.find((subject) => subject.name === subject2.name)?.average, 10)
    assert.equal(result.generalAverage, 15)
  })
})
