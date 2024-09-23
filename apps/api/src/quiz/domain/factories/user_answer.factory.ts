import {
  CreateUserAnswerDto,
  CreateUserAnswerDtoQcm,
  CreateUserAnswerDtoTextHole,
  UserAnswer,
  UserAnswerQcm,
  UserAnswerTextHole,
} from '#quiz/domain/models/user_answer/user_answer'
import { QuestionType } from '#quiz/domain/models/quiz/question'
import { InvalidQuestionTypeException } from '#quiz/domain/models/quiz/exceptions/invalid_question_type.exception'

export class UserAnswerFactory {
  static create(createUserAnswer: CreateUserAnswerDtoQcm): UserAnswerQcm
  static create(createUserAnswer: CreateUserAnswerDtoTextHole): UserAnswerTextHole
  static create(createUserAnswer: CreateUserAnswerDto): UserAnswer
  static create(createUserAnswer: CreateUserAnswerDto): UserAnswer {
    if (createUserAnswer.type === QuestionType.QCM) return new UserAnswerQcm(createUserAnswer)

    if (createUserAnswer.type === QuestionType.TEXT_HOLE)
      return new UserAnswerTextHole(createUserAnswer)

    throw new InvalidQuestionTypeException()
  }
}
