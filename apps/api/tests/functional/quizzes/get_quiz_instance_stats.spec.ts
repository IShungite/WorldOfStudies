import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { IUserAnswersRepository } from '#quiz/domain/contracts/user_answers.repository'
import { QuizInstanceNotFoundException } from '#quiz/domain/models/quiz/exceptions/quiz_instance_not_found.exception'
import { QuestionQcm } from '#quiz/domain/models/quiz/question'
import { QuizInstanceStatus } from '#quiz/domain/models/quiz/quiz_instance'
import { UserAnswerQcm, UserAnswerTextHole } from '#quiz/domain/models/user_answer/user_answer'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { ISubjectsRepository } from '#school/domain/contracts/repositories/subjects.repository'
import { Id } from '#shared/id/domain/models/id'
import { CharacterBuilderTest } from '#tests/builders/character_builder_test'
import { QuizBuilderTest } from '#tests/builders/quiz_builder_test'
import { QuizInstanceBuilderTest } from '#tests/builders/quiz_instance_builder_test'
import { SchoolBuilderTest } from '#tests/builders/school_builder_test'
import { SubjectBuilderTest } from '#tests/builders/subject_builder_test'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { test } from '@japa/runner'
import { QuizStat } from '@world-of-studies/api-types'
import { StatusCodes } from 'http-status-codes'

test.group('Quiz instance - stats', (group) => {
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

  test("It should return a 400 if the user doesn't own the quiz instance", async ({ client }) => {
    const [user1, user2, subject1] = await Promise.all([
      usersRepository.save(new UserBuilderTest().build()),
      usersRepository.save(new UserBuilderTest().build()),
      subjectsRepository.save(new SubjectBuilderTest().build()),
    ])

    const school = await schoolsRepository.save(
      new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).withSubjects([subject1]).build()
    )

    const character = await charactersRepository.save(
      new CharacterBuilderTest().withUser(user1).withPromotion(school.promotions[0]).build()
    )

    const [quiz1] = await Promise.all([
      quizzesRepository.save(
        new QuizBuilderTest().withName('Quiz 1').withSubject(subject1).build()
      ),
    ])
    const quizInstance1 = await quizzesInstanceRepository.save(
      new QuizInstanceBuilderTest().withQuiz(quiz1).withCharacterId(character.id).build()
    )

    const response = await client.get(`/quiz-instances/${quizInstance1.id}/stats`).loginWith(user2)

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test("It should return a 400 if the quiz instance doesn't exist", async ({ client, assert }) => {
    const user = await usersRepository.save(new UserBuilderTest().build())

    const quizInstanceId = Id.factory()
    const response = await client.get(`/quiz-instances/${quizInstanceId}/stats`).loginWith(user)

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new QuizInstanceNotFoundException(quizInstanceId).message)
  })

  test('It should return the stats of the quiz instance', async ({ client, assert }) => {
    const [user1, subject1] = await Promise.all([
      usersRepository.save(new UserBuilderTest().build()),
      subjectsRepository.save(new SubjectBuilderTest().build()),
    ])

    const school = await schoolsRepository.save(
      new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).withSubjects([subject1]).build()
    )

    const character = await charactersRepository.save(
      new CharacterBuilderTest().withUser(user1).withPromotion(school.promotions[0]).build()
    )

    const [quiz1] = await Promise.all([
      quizzesRepository.save(
        new QuizBuilderTest().withName('Quiz 1').withSubject(subject1).build()
      ),
    ])
    const quizInstance1 = await quizzesInstanceRepository.save(
      new QuizInstanceBuilderTest()
        .withQuiz(quiz1)
        .withCharacterId(character.id)
        .withStatus(QuizInstanceStatus.COMPLETED)
        .build()
    )

    const lastAnswerDate = new Date(new Date().setDate(new Date().getDate() + 3))

    await Promise.all([
      // Quiz 1
      userAnswersRepository.save(
        new UserAnswerQcm({
          characterId: character.id,
          questionId: quiz1.questions[0].id,
          choiceId: (quiz1.questions[0] as QuestionQcm).choices[0].id,
          quizInstanceId: quizInstance1.id,
          createdAt: new Date(),
        })
      ),
      userAnswersRepository.save(
        new UserAnswerQcm({
          characterId: character.id,
          questionId: quiz1.questions[1].id,
          choiceId: (quiz1.questions[1] as QuestionQcm).choices[1].id,
          quizInstanceId: quizInstance1.id,
          createdAt: new Date(),
        })
      ),
      userAnswersRepository.save(
        new UserAnswerTextHole({
          characterId: character.id,
          questionId: quiz1.questions[2].id,
          quizInstanceId: quizInstance1.id,
          values: ['Paris'],
          createdAt: lastAnswerDate,
        })
      ),
    ])

    const response = await client.get(`/quiz-instances/${quizInstance1.id}/stats`).loginWith(user1)

    response.assertStatus(StatusCodes.OK)

    const body: QuizStat = response.body().result

    assert.equal(body.name, quiz1.name)
    assert.equal(body.score, 20)
    assert.equal(body.maxScore, 20)
    assert.equal(body.date, lastAnswerDate.toString())
  })
})
