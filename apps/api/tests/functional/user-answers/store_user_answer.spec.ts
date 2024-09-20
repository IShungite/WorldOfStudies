import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { IUserAnswersRepository } from '#quiz/domain/contracts/user_answers.repository'
import { QuizFactory } from '#quiz/domain/factories/quiz.factory'
import { QuestionQcm, questionType } from '#quiz/domain/models/quiz/question'
import { QuizInstance } from '#quiz/domain/models/quiz/quiz_instance'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { ISubjectsRepository } from '#school/domain/contracts/repositories/subjects.repository'
import { CharacterBuilderTest } from '#tests/builders/character_builder_test'
import { QuizBuilderTest } from '#tests/builders/quiz_builder_test'
import { SchoolBuilderTest } from '#tests/builders/school_builder_test'
import { SubjectBuilderTest } from '#tests/builders/subject_builder_test'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'

test.group('User-answers - store', (group) => {
  let userAnswersRepository: IUserAnswersRepository
  let quizzesRepository: IQuizzesRepository
  let usersRepository: IUsersRepository
  let charactersRepository: ICharactersRepository
  let schoolsRepository: ISchoolsRepository
  let quizzesInstanceRepository: IQuizzesInstanceRepository
  let subjectRepository: ISubjectsRepository

  group.setup(async () => {
    ;[
      userAnswersRepository,
      quizzesRepository,
      usersRepository,
      charactersRepository,
      schoolsRepository,
      quizzesInstanceRepository,
      subjectRepository,
    ] = await createRepositories([
      IUserAnswersRepository,
      IQuizzesRepository,
      IUsersRepository,
      ICharactersRepository,
      ISchoolsRepository,
      IQuizzesInstanceRepository,
      ISubjectsRepository,
    ])
  })

  group.each.setup(async () => {
    await emptyRepositories([
      userAnswersRepository,
      quizzesRepository,
      usersRepository,
      charactersRepository,
      schoolsRepository,
      subjectRepository,
    ])
  })

  test('It should return a 422 if the payload is invalid', async ({ client }) => {
    const response = await client.post('quiz-instances/1/questions/1/user-answers').json({})

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should create a user-answer of type QCM', async ({ client }) => {
    const subject = await subjectRepository.save(new SubjectBuilderTest().build())
    const user = new UserBuilderTest().build()
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()
    const character = new CharacterBuilderTest()
      .withUser(user)
      .withPromotion(school.promotions[0])
      .build()

    const quiz = await quizzesRepository.save(new QuizBuilderTest().withSubject(subject).build())

    await Promise.all([
      usersRepository.save(user),
      quizzesRepository.save(quiz),
      schoolsRepository.save(school),
    ])
    await charactersRepository.save(character)

    const quizInstance = await quizzesInstanceRepository.save(
      new QuizInstance({
        quiz,
        characterId: character.id,
        userAnswers: [],
      })
    )

    const question = quiz.questions[0] as QuestionQcm

    const payload = {
      type: questionType.QCM,
      questionId: question.id.toString(),
      choiceId: question.choices[0].id.toString(),
      characterId: character.id.toString(),
    }

    const response = await client
      .post(
        `quiz-instances/${quizInstance.id.toString()}/questions/${question.id.toString()}/user-answers`
      )
      .json(payload)

    response.assertStatus(StatusCodes.CREATED)
    response.assertBodyContains({
      result: {
        type: questionType.QCM,
        questionId: payload.questionId,
        characterId: payload.characterId,
      },
    })
  })
})
