import { QuestionType, questionType } from './question.js'

type UserAnswerProps = {
  id?: string
  questionId: string
  userId: string
  type: QuestionType
}

type CreateUserAnswerDtoBase = {
  id?: string
  questionId: string
  userId: string
  type: QuestionType
}

export type CreateUserAnswerDtoQcm = CreateUserAnswerDtoBase & {
  type: 'qcm'
  choiceId: string
}

export type CreateUserAnswerDtoTextHole = CreateUserAnswerDtoBase & {
  type: 'text-hole'
  values: string[]
}

export type CreateUserAnswer = CreateUserAnswerDtoQcm | CreateUserAnswerDtoTextHole

export abstract class UserAnswer {
  readonly id: string
  readonly questionId: string
  readonly userId: string
  readonly type: QuestionType

  constructor({ id, questionId, userId, type }: UserAnswerProps) {
    this.id = id ?? String(Math.random())
    this.questionId = questionId
    this.userId = userId
    this.type = type
  }
}

export class UserAnswerQcm extends UserAnswer {
  readonly choiceId: string
  constructor({
    id,
    questionId,
    userId,
    choiceId,
  }: Omit<UserAnswerProps, 'type'> & { choiceId: string }) {
    super({ id, questionId, userId, type: questionType.QCM })
    this.choiceId = choiceId
  }
}

export class UserAnswerTextHole extends UserAnswer {
  readonly values: string[]
  constructor({
    id,
    questionId,
    userId,
    values,
  }: Omit<UserAnswerProps, 'type'> & { values: string[] }) {
    super({ id, questionId, userId, type: questionType.TEXT_HOLE })
    this.values = values
  }
}
