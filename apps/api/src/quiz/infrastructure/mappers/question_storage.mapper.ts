import { Id } from '#shared/id/domain/models/id'
import {
  Question,
  QuestionQcm,
  QuestionTextHole,
  questionType,
} from '#quiz/domain/models/quiz/question'
import { InvalidQuestionTypeException } from '#quiz/domain/models/quiz/exceptions/invalid_question_type.exception'
import QuestionEntity from '#quiz/infrastructure/entities/question'

export class QuestionStorageMapper {
  static fromLucid(question: QuestionEntity): Question {
    const extra = JSON.parse(question.extra)
    const id = new Id(question.id.toString())

    if (question.type === questionType.QCM) {
      return new QuestionQcm({
        id: id,
        points: question.points,
        choices: extra.choices,
      })
    }

    if (question.type === questionType.TEXT_HOLE) {
      return new QuestionTextHole({
        id: id,
        points: question.points,
        text: extra.text,
        answers: extra.answers,
      })
    }

    throw new InvalidQuestionTypeException()
  }
}
