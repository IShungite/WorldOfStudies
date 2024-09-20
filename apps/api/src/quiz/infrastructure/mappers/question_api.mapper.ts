import { Question, QuestionQcm, QuestionTextHole } from '#quiz/domain/models/quiz/question'

export class QuestionApiMapper {
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
      text: question.text,
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
      answers: question.answers,
    }
  }
}
