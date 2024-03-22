import { Question, QuestionQcm, QuestionTextHole, questionType } from '#domainModels/quiz/question'
import QuestionEntity from '#models/question'
import { Id } from '#domainModels/id/id'
import { InvalidQuestionTypeException } from '#domainModels/quiz/invalid_question_type.exception'

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

  static fromAdonis(question: QuestionEntity): Question {
    const extra = JSON.parse(question.extra)
    if (question.type === questionType.QCM) {
      return new QuestionQcm({
        id: new Id(question.id.toString()),
        points: question.points,
        choices: extra.choices,
      })
    }

    if (question.type === questionType.TEXT_HOLE) {
      return new QuestionTextHole({
        id: new Id(question.id.toString()),
        points: question.points,
        text: extra.text,
        answers: extra.answers,
      })
    }

    throw new InvalidQuestionTypeException()
  }
}
