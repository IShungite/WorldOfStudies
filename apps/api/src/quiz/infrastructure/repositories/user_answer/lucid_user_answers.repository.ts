import testUtils from '@adonisjs/core/services/test_utils'
import { IUserAnswersRepository } from '#quiz/domain/contracts/user_answers.repository'
import {
  UserAnswer,
  UserAnswerQcm,
  UserAnswerTextHole,
} from '#quiz/domain/models/user_answer/user_answer'
import UserAnswerEntity from '#quiz/infrastructure/entities/user_answer'
import { Id } from '#shared/id/domain/models/id'
import { UserAnswerStorageMapper } from '#quiz/infrastructure/mappers/user_answer_storage.mapper'
import { DateTime } from 'luxon'

export class LucidUserAnswersRepository implements IUserAnswersRepository {
  async save(userAnswer: UserAnswer): Promise<UserAnswer> {
    let extra: Record<string, unknown> = {}

    if (userAnswer instanceof UserAnswerQcm) {
      extra = {
        choiceId: userAnswer.choiceId.toString(),
      }
    } else if (userAnswer instanceof UserAnswerTextHole) {
      extra = {
        values: userAnswer.values,
      }
    }

    await UserAnswerEntity.updateOrCreate(
      {
        id: Number.parseInt(userAnswer.id.toString(), 10),
      },
      {
        id: Number.parseInt(userAnswer.id.toString(), 10),
        type: userAnswer.type,
        characterId: Number.parseInt(userAnswer.characterId.toString(), 10),
        questionId: Number.parseInt(userAnswer.questionId.toString(), 10),
        quizInstanceId: Number.parseInt(userAnswer.quizInstanceId.toString(), 10),
        extra: JSON.stringify(extra),
        createdAt: DateTime.fromJSDate(userAnswer.createdAt),
      }
    )

    return userAnswer
  }

  async getAllByQuizInstanceId(quizInstanceId: Id): Promise<UserAnswer[]> {
    const userAnswers = await UserAnswerEntity.query()
      .select('user_answers.*')
      .innerJoin('questions', 'questions.id', 'user_answers.question_id')
      .where('user_answers.quiz_instance_id', quizInstanceId.toString())

    return userAnswers.map((userAnswer) => {
      return UserAnswerStorageMapper.fromLucid(userAnswer, quizInstanceId)
    })
  }

  async empty(): Promise<void> {
    await testUtils
      .db()
      .truncate()
      .then((trunc) => trunc())
  }
}
