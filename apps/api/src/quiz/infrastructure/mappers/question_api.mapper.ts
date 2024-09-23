import {
  Question,
  QuestionQcm,
  QuestionTextHole,
  QuestionType,
} from '#quiz/domain/models/quiz/question'
import { QCMQuestionResponse, TextHoleQuestionResponse } from '@world-of-studies/api-types'

export class QuestionApiMapper {
  static toResponse(question: Question): QCMQuestionResponse | TextHoleQuestionResponse {
    if (question instanceof QuestionQcm) {
      return this.toResponseQcm(question)
    }

    if (question instanceof QuestionTextHole) {
      return this.toResponseTextHole(question)
    }

    throw new Error('Question type not supported')
  }

  private static toResponseBase(question: Question) {
    return {
      id: question.id.toString(),
      points: question.points,
      text: question.text,
    }
  }

  private static toResponseQcm(question: QuestionQcm): QCMQuestionResponse {
    return {
      ...this.toResponseBase(question),
      type: QuestionType.QCM,
      choices: question.choices.map((choice) => ({
        id: choice.id.toString(),
        label: choice.label,
      })),
    }
  }

  private static toResponseTextHole(question: QuestionTextHole): TextHoleQuestionResponse {
    return {
      ...this.toResponseBase(question),
      type: QuestionType.TEXT_HOLE,
      answers: question.answers,
    }
  }
}
