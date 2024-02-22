import { Id } from '#domainModels/id'
import { QuestionType, questionType } from '#domainModels/exercice/question'

type UserAnswerProps = {
  id?: Id
  questionId: Id
  userId: Id
  type: QuestionType
}

type CreateUserAnswerDtoBase = {
  id?: Id
  questionId: Id
  userId: Id
  type: QuestionType
}

export type CreateUserAnswerDtoQcm = CreateUserAnswerDtoBase & {
  type: 'qcm'
  choiceId: Id
}

export type CreateUserAnswerDtoTextHole = CreateUserAnswerDtoBase & {
  type: 'text-hole'
  values: string[]
}

export type CreateUserAnswerDto = CreateUserAnswerDtoQcm | CreateUserAnswerDtoTextHole

export abstract class UserAnswer {
  readonly id: Id
  readonly questionId: Id
  readonly userId: Id
  readonly type: QuestionType

  constructor({ id, questionId, userId, type }: UserAnswerProps) {
    this.id = id ?? Id.factory()
    this.questionId = questionId
    this.userId = userId
    this.type = type
  }
}

export class UserAnswerQcm extends UserAnswer {
  readonly choiceId: Id
  constructor({
    id,
    questionId,
    userId,
    choiceId,
  }: Omit<UserAnswerProps, 'type'> & { choiceId: Id }) {
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
