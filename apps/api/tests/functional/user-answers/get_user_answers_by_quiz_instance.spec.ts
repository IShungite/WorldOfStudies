import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { IUserAnswersRepository } from '#quiz/domain/contracts/user_answers.repository'
import { QuestionQcm } from '#quiz/domain/models/quiz/question'
import { UserAnswerQcm } from '#quiz/domain/models/user_answer/user_answer'
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
import { StatusCodes } from 'http-status-codes'

test.group('User-answers - get by quiz instance', (group) => {
  let userAnswersRepository: IUserAnswersRepository
  let quizzesRepository: IQuizzesRepository
  let usersRepository: IUsersRepository
  let charactersRepository: ICharactersRepository
  let schoolsRepository: ISchoolsRepository
  let quizzesInstanceRepository: IQuizzesInstanceRepository
  let subjectsRepository: ISubjectsRepository

  group.setup(async () => {
    ;[
      userAnswersRepository,
      quizzesRepository,
      usersRepository,
      charactersRepository,
      schoolsRepository,
      quizzesInstanceRepository,
      subjectsRepository,
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
      subjectsRepository,
    ])
  })

  test('It should return the user answers of a quiz', async ({ client, assert }) => {
    const subject = await subjectsRepository.save(new SubjectBuilderTest().build())
    const user = new UserBuilderTest().build()
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()
    const character = new CharacterBuilderTest()
      .withUser(user)
      .withPromotion(school.promotions[0])
      .build()
    const user2 = new UserBuilderTest().build()
    const character2 = new CharacterBuilderTest()
      .withUser(user2)
      .withPromotion(school.promotions[0])
      .build()

    const [quiz, quiz2] = await Promise.all([
      quizzesRepository.save(new QuizBuilderTest().withSubject(subject).build()),
      quizzesRepository.save(new QuizBuilderTest().withSubject(subject).build()),
    ])

    const quizInstance = new QuizInstanceBuilderTest()
      .withQuiz(quiz)
      .withCharacterId(character.id)
      .build()
    const quizInstance2 = new QuizInstanceBuilderTest()
      .withQuiz(quiz2)
      .withCharacterId(character2.id)
      .build()

    const question = quiz.questions[0] as QuestionQcm
    const question2 = quiz2.questions[0] as QuestionQcm

    const userAnswer = new UserAnswerQcm({
      characterId: character.id,
      choiceId: question.choices[0].id,
      questionId: question.id,
      quizInstanceId: quizInstance.id,
      createdAt: new Date(),
    })
    const userAnswer2 = new UserAnswerQcm({
      characterId: character2.id,
      choiceId: question.choices[1].id,
      questionId: question.id,
      quizInstanceId: quizInstance.id,
      createdAt: new Date(),
    })
    const userAnswer3 = new UserAnswerQcm({
      characterId: character2.id,
      choiceId: question2.choices[0].id,
      questionId: question2.id,
      quizInstanceId: quizInstance2.id,
      createdAt: new Date(),
    })

    await Promise.all([
      usersRepository.save(user),
      usersRepository.save(user2),
      quizzesRepository.save(quiz),
      quizzesRepository.save(quiz2),
      schoolsRepository.save(school),
    ])
    await Promise.all([charactersRepository.save(character), charactersRepository.save(character2)])

    await Promise.all([
      quizzesInstanceRepository.save(quizInstance),
      quizzesInstanceRepository.save(quizInstance2),
    ])

    await Promise.all([
      userAnswersRepository.save(userAnswer),
      userAnswersRepository.save(userAnswer2),
      userAnswersRepository.save(userAnswer3),
    ])

    const response = await client.get(`/quiz-instances/${quizInstance.id.toString()}/user-answers`)
    response.assertStatus(StatusCodes.OK)
    const body = response.body()
    assert.lengthOf(body, 2)
    response.assertBodyContains([
      {
        result: {
          id: userAnswer.id.toString(),
        },
      },
      {
        result: {
          id: userAnswer2.id.toString(),
        },
      },
    ])
  })
})
