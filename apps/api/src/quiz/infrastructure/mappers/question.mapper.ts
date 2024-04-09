import {
  Question,
  QuestionQcm,
  QuestionTextHole,
  questionType,
} from '../../domain/models/quiz/question.js'
import QuestionEntity from '../entities/question.js'
import { Id } from '../../../shared/id/domain/models/id.js'
import { InvalidQuestionTypeException } from '../../domain/models/quiz/invalid_question_type.exception.js'

export class QuestionMapper {
  static toResponse(question: Question) {
    return {
      ...this.toResponseBase(question),
      ...{
        ...(question instanceof QuestionQcm && this.toResponseQcm(question)),
        ...(question instanceof QuestionTextHole && this.toResponseTextHole(question)),
      },
    }
  }

  private static toResponseBase(question: Question) {
    return {
      id: question.id.toString(),
      type: question.type,
      points: question.points,
    }
  }

  private static toResponseQcm(question: QuestionQcm) {
    return {
      choices: question.choices.map((choice) => ({
        id: choice.id.toString(),
        label: choice.label,
        isCorrect: choice.isCorrect,
      })),
    }
  }

  private static toResponseTextHole(question: QuestionTextHole) {
    return {
      text: question.text,
      answers: question.answers,
    }
  }

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
