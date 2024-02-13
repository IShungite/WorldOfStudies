import { UserAnswerQcm, UserAnswerTextHole } from './user_answer.js'

export const questionType = {
  QCM: 'qcm',
  TEXT_HOLE: 'text-hole',
} as const
export type QuestionType = (typeof questionType)[keyof typeof questionType]

export type CreateQuestionDto = {
  type: QuestionType
}

type QuestionProps = { id?: string; type: QuestionType }

export class Question {
  readonly id: string
  readonly type: QuestionType

  constructor({ id, type }: QuestionProps) {
    this.id = id ?? String(Math.random())
    this.type = type
  }
}

export class QuestionQcm extends Question {
  readonly choices: { id: string; label: string; isCorrect: boolean }[]

  constructor({
    id,
    choices,
  }: Omit<QuestionProps, 'type'> & {
    choices: { id: string; label: string; isCorrect: boolean }[]
  }) {
    super({ id, type: questionType.QCM })
    this.choices = choices
  }

  private isCorrectChoice(choiceId: string): boolean {
    const choice = this.choices.find((c) => c.id === choiceId)

    if (!choice) {
      throw new Error('Choice not found')
    }

    return choice.isCorrect
  }

  isCorrectUserAnswer(userAnswer: UserAnswerQcm): boolean {
    return this.isCorrectChoice(userAnswer.choiceId)
  }
}

export class QuestionTextHole extends Question {
  readonly text: string
  readonly answers: string[]

  constructor({
    id,
    text,
    answers,
  }: Omit<QuestionProps, 'type'> & { text: string; answers: string[] }) {
    super({ id, type: questionType.TEXT_HOLE })
    this.text = text
    this.answers = answers
  }

  private isCorrectAnswer(answers: string[]): boolean {
    return this.answers.toSorted().join(',') === answers.toSorted().join(',')
  }

  isCorrectUserAnswer(userAnswer: UserAnswerTextHole): boolean {
    return this.isCorrectAnswer(userAnswer.values)
  }
}
