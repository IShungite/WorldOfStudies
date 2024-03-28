import { InvalidQuestionTypeException } from '#domain/models/quiz/invalid_question_type.exception'
import {
  CreateQuestionDto,
  CreateQuestionDtoQcm,
  CreateQuestionDtoTextHole,
  Question,
  QuestionQcm,
  QuestionTextHole,
  questionType,
} from '#domain/models/quiz/question'

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
