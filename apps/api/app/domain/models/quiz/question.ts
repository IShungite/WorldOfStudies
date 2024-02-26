import { UserAnswer, UserAnswerQcm, UserAnswerTextHole } from '#domainModels/quiz/user_answer'
import { Id } from '#domainModels/id'

export const questionType = {
  QCM: 'qcm',
  TEXT_HOLE: 'text-hole',
} as const
export type QuestionType = (typeof questionType)[keyof typeof questionType]

type CreateQuestionDtoBase = {
  id?: Id
  type: QuestionType
  points: number
}

export type CreateQuestionDtoQcm = CreateQuestionDtoBase & {
  type: 'qcm'
  choices: { id?: Id; label: string; isCorrect: boolean }[]
}

export type CreateQuestionDtoTextHole = CreateQuestionDtoBase & {
  type: 'text-hole'
  text: string
  answers: string[]
}

export type CreateQuestionDto = CreateQuestionDtoQcm | CreateQuestionDtoTextHole

type QuestionProps = { id?: Id; type: QuestionType; points: number }

export abstract class Question {
  readonly id: Id
  readonly type: QuestionType
  readonly points: number

  constructor({ id, type, points }: QuestionProps) {
    this.id = id ?? Id.factory()
    this.type = type
    this.points = points
  }

  abstract getUserAnswerPoints(userAnswer: UserAnswer): number
}

export class QuestionQcm extends Question {
  readonly choices: { id: Id; label: string; isCorrect: boolean }[]

  constructor({
    id,
    points,
    choices,
  }: Omit<QuestionProps, 'type'> & {
    choices: { id?: Id; label: string; isCorrect: boolean }[]
  }) {
    super({ id, points, type: questionType.QCM })
    this.choices = choices.map((choice) => ({ ...choice, id: choice.id ?? Id.factory() }))
  }

  private isCorrectChoice(choiceId: Id): boolean {
    const choice = this.choices.find((c) => c.id === choiceId)

    if (!choice) {
      throw new Error('Choice not found')
    }

    return choice.isCorrect
  }

  private isCorrectUserAnswer(userAnswer: UserAnswerQcm): boolean {
    return this.isCorrectChoice(userAnswer.choiceId)
  }

  getUserAnswerPoints(userAnswer: UserAnswerQcm): number {
    if (this.isCorrectUserAnswer(userAnswer)) {
      return this.points
    }
    return 0
  }
}

export class QuestionTextHole extends Question {
  readonly text: string
  readonly answers: string[]

  constructor({
    id,
    points,
    text,
    answers,
  }: Omit<QuestionProps, 'type'> & { text: string; answers: string[] }) {
    super({ id, points, type: questionType.TEXT_HOLE })
    this.text = text
    this.answers = answers
  }

  private getCorrectAnswers(answers: string[]): string[] {
    const correctAnswers: string[] = []

    this.answers.forEach((answer, index) => {
      if (answer === answers[index]) {
        correctAnswers.push(answer)
      }
    })

    return correctAnswers
  }

  getUserAnswerPoints(userAnswer: UserAnswerTextHole): number {
    const correctAnswers = this.getCorrectAnswers(userAnswer.values)

    return (correctAnswers.length * this.points) / this.answers.length
  }
}
