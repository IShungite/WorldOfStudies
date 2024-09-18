import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { QuizFactory } from '#quiz/domain/factories/quiz.factory'
import { QuestionQcm, questionType } from '#quiz/domain/models/quiz/question'
import { IUserAnswersRepository } from '#quiz/domain/contracts/user_answers.repository'
import { UserAnswerQcm } from '#quiz/domain/models/user_answer/user_answer'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { SchoolBuilderTest } from '#tests/builders/school_builder_test'
import { QuizInstance } from '#quiz/domain/models/quiz/quiz_instance'
import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { CharacterBuilderTest } from '#tests/builders/character_builder_test'

test.group('User-answers - get by quiz instance', (group) => {
  let userAnswersRepository: IUserAnswersRepository
  let quizzesRepository: IQuizzesRepository
  let usersRepository: IUsersRepository
  let charactersRepository: ICharactersRepository
  let schoolsRepository: ISchoolsRepository
  let quizzesInstanceRepository: IQuizzesInstanceRepository

  group.setup(async () => {
    ;[
      userAnswersRepository,
      quizzesRepository,
      usersRepository,
      charactersRepository,
      schoolsRepository,
      quizzesInstanceRepository,
    ] = await createRepositories([
      IUserAnswersRepository,
      IQuizzesRepository,
      IUsersRepository,
      ICharactersRepository,
      ISchoolsRepository,
      IQuizzesInstanceRepository,
    ])
  })

  group.each.setup(async () => {
    await await emptyRepositories([
      userAnswersRepository,
      quizzesRepository,
      usersRepository,
      charactersRepository,
      schoolsRepository,
    ])
  })

  test('It should return the user answers of a quiz', async ({ client, assert }) => {
    const user = new UserBuilderTest().build()
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 1).build()
    const character = new CharacterBuilderTest()
      .withUser(user)
      .withPromotion(school.promotions[0])
      .build()
    const user2 = new UserBuilderTest().build()
    const character2 = new CharacterBuilderTest()
      .withUser(user2)
      .withPromotion(school.promotions[0])
      .build()

    const quiz = QuizFactory.create({
      name: 'Quiz 1',
      subjectId: school.promotions[0].subjects[0].id,
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

    const quiz2 = QuizFactory.create({
      name: 'Quiz 2',
      subjectId: school.promotions[0].subjects[0].id,
      questions: [
        {
          type: questionType.QCM,
          points: 1,
          choices: [{ isCorrect: true, label: 'Choice 1' }],
        },
      ],
    })

    const quizInstance = new QuizInstance({
      quiz,
      characterId: character.id,
    })
    const quizInstance2 = new QuizInstance({
      quiz: quiz2,
      characterId: character2.id,
    })

    const question = quiz.questions[0] as QuestionQcm
    const question2 = quiz2.questions[0] as QuestionQcm

    const userAnswer = new UserAnswerQcm({
      characterId: character.id,
      choiceId: question.choices[0].id,
      questionId: question.id,
      quizInstanceId: quizInstance.id,
    })
    const userAnswer2 = new UserAnswerQcm({
      characterId: character2.id,
      choiceId: question.choices[1].id,
      questionId: question.id,
      quizInstanceId: quizInstance.id,
    })
    const userAnswer3 = new UserAnswerQcm({
      characterId: character2.id,
      choiceId: question2.choices[0].id,
      questionId: question2.id,
      quizInstanceId: quizInstance2.id,
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
