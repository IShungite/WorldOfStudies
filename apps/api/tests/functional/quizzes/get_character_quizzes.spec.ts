import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { IUserAnswersRepository } from '#quiz/domain/contracts/user_answers.repository'
import { QuizInstanceStatus } from '#quiz/domain/models/quiz/quiz_instance'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { ISubjectsRepository } from '#school/domain/contracts/repositories/subjects.repository'
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
import { QuizOfCharacter } from '@world-of-studies/api-types'
import { PaginatedResponse } from '../../../../../packages/api-types/src/pagination/paginated_response.js'
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
      quizzesRepository.save(
        new QuizBuilderTest().withName('Quiz 2').withSubject(subject1).build()
      ),
    ])
    await quizzesInstanceRepository.save(
      new QuizInstanceBuilderTest()
        .withQuiz(quiz1)
        .withCharacterId(character.id)
        .withStatus(QuizInstanceStatus.COMPLETED)
        .build()
    )

    const response = await client.get(`/characters/${character.id}/quizzes`).loginWith(user1)

    response.assertStatus(StatusCodes.OK)

    const body: PaginatedResponse<QuizOfCharacter> = response.body()

    assert.equal(body.results.length, 2)
    assert.equal(
      body.results.find((quiz) => quiz.id === quiz1.id.toString())?.last_quiz_instance_status,
      QuizInstanceStatus.COMPLETED
    )
  })
})
