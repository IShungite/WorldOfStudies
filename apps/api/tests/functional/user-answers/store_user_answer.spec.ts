import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { IUserAnswersRepository } from '#quiz/domain/contracts/user_answers.repository'
import { QuestionQcm } from '#quiz/domain/models/quiz/question'
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
import { QuestionType } from '#quiz/domain/models/quiz/question'
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
      new QuizInstanceBuilderTest().withQuiz(quiz).withCharacterId(character.id).build()
    )

    const question = quiz.questions[0] as QuestionQcm

    const payload = {
      type: QuestionType.QCM,
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
        type: QuestionType.QCM,
        questionId: payload.questionId,
        characterId: payload.characterId,
      },
    })
  })

  test('It should complete the quiz instance when all questions are answered', async ({
    client,
    assert,
  }) => {
    const subject = await subjectRepository.save(new SubjectBuilderTest().build())
    const user = new UserBuilderTest().build()
    const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()
    const character = new CharacterBuilderTest()
      .withUser(user)
      .withPromotion(school.promotions[0])
      .build()

    const quiz = await quizzesRepository.save(
      new QuizBuilderTest()
        .withSubject(subject)
        .withQuestions([
          {
            type: QuestionType.QCM,
            points: 1,
            text: 'What is the capital of France?',
            choices: [
              { label: 'Paris', isCorrect: true },
              { label: 'London', isCorrect: false },
            ],
          },
          {
            type: QuestionType.QCM,
            points: 1,
            text: 'What is the capital of UK?',
            choices: [
              { label: 'Paris', isCorrect: false },
              { label: 'London', isCorrect: true },
            ],
          },
        ])
        .build()
    )

    await Promise.all([
      usersRepository.save(user),
      quizzesRepository.save(quiz),
      schoolsRepository.save(school),
    ])
    await charactersRepository.save(character)

    const quizInstance = await quizzesInstanceRepository.save(
      new QuizInstanceBuilderTest().withQuiz(quiz).withCharacterId(character.id).build()
    )

    const question = quiz.questions[0] as QuestionQcm

    const payload = {
      type: QuestionType.QCM,
      questionId: question.id.toString(),
      choiceId: question.choices[0].id.toString(),
      characterId: character.id.toString(),
    }

    await client
      .post(
        `quiz-instances/${quizInstance.id.toString()}/questions/${question.id.toString()}/user-answers`
      )
      .json(payload)

    const quizInstanceUpdated = await quizzesInstanceRepository.getById(quizInstance.id)

    assert.equal(quizInstanceUpdated!.status, QuizInstanceStatus.IN_PROGRESS)

    const question2 = quiz.questions[1] as QuestionQcm

    const payload2 = {
      type: QuestionType.QCM,
      questionId: question2.id.toString(),
      choiceId: question2.choices[0].id.toString(),
      characterId: character.id.toString(),
    }

    await client
      .post(
        `quiz-instances/${quizInstance.id.toString()}/questions/${question2.id.toString()}/user-answers`
      )
      .json(payload2)

    const quizInstanceUpdated2 = await quizzesInstanceRepository.getById(quizInstance.id)

    assert.equal(quizInstanceUpdated2!.status, QuizInstanceStatus.COMPLETED)
  })
})
