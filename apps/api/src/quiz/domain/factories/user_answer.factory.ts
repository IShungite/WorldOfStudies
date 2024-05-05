import {
  CreateUserAnswerDto,
  CreateUserAnswerDtoQcm,
  CreateUserAnswerDtoTextHole,
  UserAnswer,
  UserAnswerQcm,
  UserAnswerTextHole,
} from '#quiz/domain/models/user_answer/user_answer'
import { questionType } from '#quiz/domain/models/quiz/question'
import { InvalidQuestionTypeException } from '#quiz/domain/models/quiz/exceptions/invalid_question_type.exception'

export class UserAnswerFactory {
  static create(createUserAnswer: CreateUserAnswerDtoQcm): UserAnswerQcm
  static create(createUserAnswer: CreateUserAnswerDtoTextHole): UserAnswerTextHole
  static create(createUserAnswer: CreateUserAnswerDto): UserAnswer
  static create(createUserAnswer: CreateUserAnswerDto): UserAnswer {
    if (createUserAnswer.type === questionType.QCM) return new UserAnswerQcm(createUserAnswer)

    if (createUserAnswer.type === questionType.TEXT_HOLE)
      return new UserAnswerTextHole(createUserAnswer)

    throw new InvalidQuestionTypeException()
  }
}
