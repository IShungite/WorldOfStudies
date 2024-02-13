type QuestionType = 'qcm' | 'text-hole'

export type CreateQuestionDto = {
  type: QuestionType
}

export class Question {
  readonly id: string

  constructor(
    readonly type: QuestionType,
    id?: string
  ) {
    this.id = id ?? String(Math.random())
  }
}
