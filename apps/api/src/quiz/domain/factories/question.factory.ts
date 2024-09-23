import {
  CreateQuestionDto,
  CreateQuestionDtoQcm,
  CreateQuestionDtoTextHole,
  QCMChoice,
  Question,
  QuestionQcm,
  QuestionTextHole,
} from '#quiz/domain/models/quiz/question'
import { InvalidQuestionTypeException } from '#quiz/domain/models/quiz/exceptions/invalid_question_type.exception'
import { QuestionType } from '#quiz/domain/models/quiz/question'

export class QuestionFactory {
  static create(createQuestionDto: CreateQuestionDtoQcm): QuestionQcm
  static create(createQuestionDto: CreateQuestionDtoTextHole): QuestionTextHole
  static create(createQuestionDto: CreateQuestionDto): Question
  static create(createQuestionDto: CreateQuestionDto): Question {
    if (createQuestionDto.type === QuestionType.QCM)
      return new QuestionQcm({
        id: createQuestionDto.id,
        choices: createQuestionDto.choices.map((choice) => new QCMChoice(choice)),
        points: createQuestionDto.points,
        text: createQuestionDto.text,
      })

    if (createQuestionDto.type === QuestionType.TEXT_HOLE)
      return new QuestionTextHole(createQuestionDto)

    throw new InvalidQuestionTypeException()
  }
}
