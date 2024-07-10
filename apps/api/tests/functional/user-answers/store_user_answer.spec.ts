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
import { Character } from '#character/domain/models/character'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { SchoolBuilderTest } from '#tests/builders/school_builder_test'
import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { QuizInstance } from '#quiz/domain/models/quiz/quiz_instance'

test.group('User-answers - store', (group) => {
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

  test('It should return a 422 if the payload is invalid', async ({ client }) => {
    const response = await client.post('quiz-instances/1/questions/1/user-answers').json({})

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should create a user-answer of type QCM', async ({ client }) => {
    const user = new UserBuilderTest().build()
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()
    const character = new Character({
      name: 'test',
      userId: user.id,
      promotionId: school.promotions[0].id,
    })
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
