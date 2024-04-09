import { InvalidQuestionTypeException } from '../models/quiz/invalid_question_type.exception.js'
import {
  CreateQuestionDto,
  CreateQuestionDtoQcm,
  CreateQuestionDtoTextHole,
  Question,
  QuestionQcm,
  QuestionTextHole,
  questionType,
} from '../models/quiz/question.js'

export class QuestionFactory {
  static create(createQuestionDto: CreateQuestionDtoQcm): QuestionQcm
  static create(createQuestionDto: CreateQuestionDtoTextHole): QuestionTextHole
  static create(createQuestionDto: CreateQuestionDto): Question
  static create(createQuestionDto: CreateQuestionDto): Question {
    if (createQuestionDto.type === questionType.QCM) return new QuestionQcm(createQuestionDto)

    if (createQuestionDto.type === questionType.TEXT_HOLE)
      return new QuestionTextHole(createQuestionDto)

    throw new InvalidQuestionTypeException()
  }
}
