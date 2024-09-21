import { Id } from '#shared/id/domain/models/id'
import { questionType } from '#quiz/domain/models/quiz/question'
import {
  UserAnswer,
  UserAnswerQcm,
  UserAnswerTextHole,
} from '#quiz/domain/models/user_answer/user_answer'
import { InvalidQuestionTypeException } from '#quiz/domain/models/quiz/exceptions/invalid_question_type.exception'
import UserAnswerEntity from '#quiz/infrastructure/entities/user_answer'

export class UserAnswerStorageMapper {
  static fromLucid(userAnswerEntity: UserAnswerEntity, quizInstanceId: Id): UserAnswer {
    const extra = JSON.parse(userAnswerEntity.extra)
    const id = new Id(userAnswerEntity.id.toString())
    const characterId = new Id(userAnswerEntity.characterId.toString())
    const questionId = new Id(userAnswerEntity.questionId.toString())

    if (userAnswerEntity.type === questionType.QCM) {
      return new UserAnswerQcm({
        id: id,
        choiceId: new Id(extra.choiceId.toString()),
        characterId,
        questionId,
        quizInstanceId,
      })
    } else if (userAnswerEntity.type === questionType.TEXT_HOLE) {
      return new UserAnswerTextHole({
        id: id,
        values: extra.values,
        characterId,
        questionId,
        quizInstanceId,
      })
    }

    throw new InvalidQuestionTypeException()
  }
}
