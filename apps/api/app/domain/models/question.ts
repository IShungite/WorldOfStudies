const questionType = {
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
}
