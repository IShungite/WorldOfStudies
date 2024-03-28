import { InvalidQuestionTypeException } from '#domain/models/quiz/invalid_question_type.exception'
import { questionType } from '#domain/models/quiz/question'
import {
  CreateUserAnswerDto,
  CreateUserAnswerDtoQcm,
  CreateUserAnswerDtoTextHole,
  UserAnswer,
  UserAnswerQcm,
  UserAnswerTextHole,
} from '#domain/models/quiz/user_answer'

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
