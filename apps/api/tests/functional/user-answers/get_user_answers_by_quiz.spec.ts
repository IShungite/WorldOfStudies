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
import { UserAnswerQcm } from '#quiz/domain/models/user_answer/user_answer'

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

  test('It should return the user answers of a quiz', async ({ client, assert }) => {
    const user = new UserBuilderTest().build()
    const character = new Character({ name: 'test', userId: user.id })
    const user2 = new UserBuilderTest().build()
    const character2 = new Character({ name: 'test2', userId: user2.id })
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

    const quiz2 = QuizFactory.create({
      name: 'Quiz 2',
      questions: [
        {
          type: questionType.QCM,
          points: 1,
          choices: [{ isCorrect: true, label: 'Choice 1' }],
        },
      ],
    })

    const question = quiz.questions[0] as QuestionQcm
    const question2 = quiz2.questions[0] as QuestionQcm

    const userAnswer = new UserAnswerQcm({
      characterId: character.id,
      choiceId: question.choices[0].id,
      questionId: question.id,
    })
    const userAnswer2 = new UserAnswerQcm({
      characterId: character2.id,
      choiceId: question.choices[1].id,
      questionId: question.id,
    })
    const userAnswer3 = new UserAnswerQcm({
      characterId: character2.id,
      choiceId: question2.choices[0].id,
      questionId: question2.id,
    })

    await Promise.all([
      usersRepository.save(user),
      usersRepository.save(user2),
      quizzesRepository.save(quiz),
      quizzesRepository.save(quiz2),
    ])
    await Promise.all([charactersRepository.save(character), charactersRepository.save(character2)])
    await Promise.all([
      userAnswersRepository.save(userAnswer),
      userAnswersRepository.save(userAnswer2),
      userAnswersRepository.save(userAnswer3),
    ])

    const response = await client.get(`/quizzes/${quiz.id.toString()}/user-answers`)

    response.assertStatus(StatusCodes.OK)
    const body = response.body()
    assert.lengthOf(body, 2)
    response.assertBodyContains([
      {
        questionId: question.id.toString(),
      },
      {
        questionId: question.id.toString(),
      },
    ])
  })
})
