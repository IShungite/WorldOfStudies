import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { IUserAnswersRepository } from '#quiz/domain/contracts/user_answers.repository'
import { QuizInstanceAlreadyExists } from '#quiz/domain/models/quiz/exceptions/quiz_instance_already_exists.exception'
import { QuestionQcm } from '#quiz/domain/models/quiz/question'
import { Quiz, QuizType } from '#quiz/domain/models/quiz/quiz'
import { QuizInstanceStatus } from '#quiz/domain/models/quiz/quiz_instance'
import { UserAnswer, UserAnswerQcm } from '#quiz/domain/models/user_answer/user_answer'
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
import { StartQuizResponse } from '@world-of-studies/api-types'
import { StatusCodes } from 'http-status-codes'

test.group('Quizzes - show', (group) => {
  let quizzesRepository: IQuizzesRepository
  let quizzesInstanceRepository: IQuizzesInstanceRepository
  let usersRepository: IUsersRepository
  let schoolsRepository: ISchoolsRepository
  let charactersRepository: ICharactersRepository
  let subjectsRepository: ISubjectsRepository
  let userAnswersRepository: IUserAnswersRepository

  group.setup(async () => {
    ;[
      quizzesRepository,
      quizzesInstanceRepository,
      usersRepository,
      schoolsRepository,
      charactersRepository,
      subjectsRepository,
      userAnswersRepository,
    ] = await createRepositories([
      IQuizzesRepository,
      IQuizzesInstanceRepository,
      IUsersRepository,
      ISchoolsRepository,
      ICharactersRepository,
      ISubjectsRepository,
      IUserAnswersRepository,
    ])
  })

  group.each.setup(async () => {
    await emptyRepositories([
      quizzesRepository,
      quizzesInstanceRepository,
      usersRepository,
      schoolsRepository,
      charactersRepository,
      subjectsRepository,
      userAnswersRepository,
    ])
  })

  test('It should return a 422 if the payload is invalid', async ({ client }) => {
    const user = new UserBuilderTest().build()
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()
    const subject = new SubjectBuilderTest().build()
    const character = new CharacterBuilderTest()
      .withUser(user)
      .withPromotion(school.promotions[0])
      .build()
    const quiz = new Quiz({
      name: 'Quiz 1',
      questions: [],
      subjectId: subject.id,
    })

    await subjectsRepository.save(subject)

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

  test('It should return the remaining questions if the quiz is already started and not completed', async ({
    client,
    assert,
  }) => {
    const user = new UserBuilderTest().build()
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()
    const subject = new SubjectBuilderTest().build()
    const character = new CharacterBuilderTest()
      .withUser(user)
      .withPromotion(school.promotions[0])
      .build()
    const quiz = new QuizBuilderTest().withSubject(subject).build()

    const quizInstance = new QuizInstanceBuilderTest()
      .withQuiz(quiz)
      .withCharacterId(character.id)
      .build()

    await subjectsRepository.save(subject)

    await Promise.all([
      quizzesRepository.save(quiz),
      usersRepository.save(user),
      schoolsRepository.save(school),
    ])
    await Promise.all([
      charactersRepository.save(character),
      quizzesInstanceRepository.save(quizInstance),
      userAnswersRepository.save(
        new UserAnswerQcm({
          questionId: quiz.questions[0].id,
          quizInstanceId: quizInstance.id,
          characterId: character.id,
          choiceId: (quiz.questions[0] as QuestionQcm).choices[0].id,
          createdAt: new Date(),
        })
      ),
    ])

    const response = await client
      .post(`/quizzes/${quiz.id.toString()}/start`)
      .json({
        characterId: character.id.toString(),
      })
      .loginWith(user)

    response.assertStatus(StatusCodes.OK)

    const body: StartQuizResponse = response.body()
    assert.equal(body.result.questions.length, 3)

    body.result.questions.forEach((question) => {
      // in the test, only the first question is answered
      const questionIsAnswered = question.question.id === quiz.questions[0].id.toString()

      assert.equal(question.isAnswered, questionIsAnswered)
    })
  })

  test('It should start a new practice quiz if the previous one is already completed', async ({
    client,
    assert,
  }) => {
    const user = new UserBuilderTest().build()
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()
    const subject = new SubjectBuilderTest().build()
    const character = new CharacterBuilderTest()
      .withUser(user)
      .withPromotion(school.promotions[0])
      .build()
    const quiz = new QuizBuilderTest().withSubject(subject).withQuestions([]).build()

    const quizInstance = new QuizInstanceBuilderTest()
      .withQuiz(quiz)
      .withCharacterId(character.id)
      .withStatus(QuizInstanceStatus.COMPLETED)
      .build()

    await subjectsRepository.save(subject)

    await Promise.all([
      quizzesRepository.save(quiz),
      usersRepository.save(user),
      schoolsRepository.save(school),
    ])
    await Promise.all([
      charactersRepository.save(character),
      quizzesInstanceRepository.save(quizInstance),
    ])

    const response = await client
      .post(`/quizzes/${quiz.id.toString()}/start`)
      .json({
        characterId: character.id.toString(),
      })
      .loginWith(user)

    response.assertStatus(StatusCodes.OK)

    const body = response.body()

    assert.isFalse(new Id(body.result.quizInstanceId).equals(quizInstance.id))
  })

  test('It should return a 400 if the exam quiz is already completed', async ({
    client,
    assert,
  }) => {
    const user = new UserBuilderTest().build()
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()
    const subject = new SubjectBuilderTest().build()
    const character = new CharacterBuilderTest()
      .withUser(user)
      .withPromotion(school.promotions[0])
      .build()
    const quiz = new QuizBuilderTest()
      .withSubject(subject)
      .withQuestions([])
      .withType(QuizType.EXAM)
      .build()

    const quizInstance = new QuizInstanceBuilderTest()
      .withQuiz(quiz)
      .withCharacterId(character.id)
      .withStatus(QuizInstanceStatus.COMPLETED)
      .build()

    await subjectsRepository.save(subject)

    await Promise.all([
      quizzesRepository.save(quiz),
      usersRepository.save(user),
      schoolsRepository.save(school),
    ])
    await Promise.all([
      charactersRepository.save(character),
      quizzesInstanceRepository.save(quizInstance),
    ])

    const response = await client
      .post(`/quizzes/${quiz.id.toString()}/start`)
      .json({
        characterId: character.id.toString(),
      })
      .loginWith(user)

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should start a quiz', async ({ client, assert }) => {
    const user = new UserBuilderTest().build()
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()
    const subject = new SubjectBuilderTest().build()
    const character = new CharacterBuilderTest()
      .withUser(user)
      .withPromotion(school.promotions[0])
      .build()
    const quiz = new Quiz({
      name: 'Quiz 1',
      questions: [],
      subjectId: subject.id,
    })

    await subjectsRepository.save(subject)

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

    const body = response.body()

    response.assertStatus(StatusCodes.OK)

    assert.isNotNull(body.result.quizInstanceId)

    const quizInstance = await quizzesInstanceRepository.getById(body.result.quizInstanceId)
    assert.isNotNull(quizInstance)
  })
})
