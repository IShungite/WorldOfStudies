import { Question, QuestionQcm, QuestionTextHole } from '#domainModels/quiz/question'

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
}
