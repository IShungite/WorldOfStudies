import { UserAnswer, UserAnswerQcm, UserAnswerTextHole } from '#domainModels/quiz/user_answer'
import { IUserAnswersRepository } from '#domainPorts/out/user_answers.repository'
import testUtils from '@adonisjs/core/services/test_utils'
import UserAnswerEntity from '#models/user_answer'

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
        extra: JSON.stringify(extra),
      }
    )

    return userAnswer
  }

  async empty(): Promise<void> {
    await testUtils
      .db()
      .truncate()
      .then((trunc) => trunc())
  }
}
