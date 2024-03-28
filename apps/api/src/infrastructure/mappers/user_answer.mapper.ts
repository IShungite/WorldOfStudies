import { UserAnswer, UserAnswerQcm, UserAnswerTextHole } from '#domain/models/quiz/user_answer'
import UserAnswerEntity from '#infrastructure/entities/user_answer'
import { questionType } from '#domain/models/quiz/question'
import { Id } from '#domain/models/id/id'
import { InvalidQuestionTypeException } from '#domain/models/quiz/invalid_question_type.exception'
export class UserAnswerMapper {
  static toResponse(userAnswer: UserAnswer) {
    return {
      id: userAnswer.id.toString(),
      type: userAnswer.type,
      characterId: userAnswer.characterId.toString(),
      questionId: userAnswer.questionId.toString(),
    }
  }

  static fromLucid(userAnswerEntity: UserAnswerEntity): UserAnswer {
    const extra = JSON.parse(userAnswerEntity.extra)
    const id = new Id(userAnswerEntity.id.toString())
    const characterId = new Id(userAnswerEntity.characterId.toString())
    const questionId = new Id(userAnswerEntity.questionId.toString())

    if (userAnswerEntity.type === questionType.QCM) {
      return new UserAnswerQcm({
        id: id,
        choiceId: new Id(extra.choiceId),
        characterId: characterId,
        questionId: questionId,
      })
    } else if (userAnswerEntity.type === questionType.TEXT_HOLE) {
      return new UserAnswerTextHole({
        id: id,
        values: extra.values,
        characterId: characterId,
        questionId: questionId,
      })
    }

    throw new InvalidQuestionTypeException()
  }
}
