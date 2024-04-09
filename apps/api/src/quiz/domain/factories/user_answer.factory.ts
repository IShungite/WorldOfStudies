import { InvalidQuestionTypeException } from '../models/quiz/invalid_question_type.exception.js'
import { questionType } from '../models/quiz/question.js'
import {
  CreateUserAnswerDto,
  CreateUserAnswerDtoQcm,
  CreateUserAnswerDtoTextHole,
  UserAnswer,
  UserAnswerQcm,
  UserAnswerTextHole,
} from '../models/user_answer/user_answer.js'

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
