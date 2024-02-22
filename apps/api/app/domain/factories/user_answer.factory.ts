import { questionType } from '#domainModels/exercice/question'
import {
  CreateUserAnswer,
  CreateUserAnswerDtoQcm,
  CreateUserAnswerDtoTextHole,
  UserAnswer,
  UserAnswerQcm,
  UserAnswerTextHole,
} from '#domainModels/exercice/user_answer'

export class UserAnswerFactory {
  static create(createUserAnswer: CreateUserAnswerDtoQcm): UserAnswerQcm
  static create(createUserAnswer: CreateUserAnswerDtoTextHole): UserAnswerTextHole
  static create(createUserAnswer: CreateUserAnswer): UserAnswer {
    if (createUserAnswer.type === questionType.QCM) return new UserAnswerQcm(createUserAnswer)

    if (createUserAnswer.type === questionType.TEXT_HOLE)
      return new UserAnswerTextHole(createUserAnswer)

    throw new Error('Invalid question type')
  }
}
