import {
  Question,
  QuestionQcm,
  QuestionTextHole,
  questionType,
} from '../../domain/models/quiz/question.js'
import QuestionEntity from '../entities/question.js'
import { Id } from '../../../shared/id/domain/models/id.js'
import { InvalidQuestionTypeException } from '../../domain/models/quiz/invalid_question_type.exception.js'

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
