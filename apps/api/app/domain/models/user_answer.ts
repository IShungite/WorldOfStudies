type UserAnswerProps = {
  id?: string
  questionId: string
  userId: string
}

export class UserAnswer {
  readonly id: string
  readonly questionId: string
  readonly userId: string

  constructor({ id, questionId, userId }: UserAnswerProps) {
    this.id = id ?? String(Math.random())
    this.questionId = questionId
    this.userId = userId
  }
}
