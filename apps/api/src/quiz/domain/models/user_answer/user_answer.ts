import { Id } from '../../../../shared/id/domain/models/id.js'
import { QuestionType, questionType } from '../quiz/question.js'

type UserAnswerProps = {
  id?: Id
  questionId: Id
  characterId: Id
  type: QuestionType
}

type CreateUserAnswerDtoBase = {
  id?: Id
  questionId: Id
  characterId: Id
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
  readonly characterId: Id
  readonly type: QuestionType

  constructor({ id, questionId, characterId, type }: UserAnswerProps) {
    this.id = id ?? Id.factory()
    this.questionId = questionId
    this.characterId = characterId
    this.type = type
  }
}

export class UserAnswerQcm extends UserAnswer {
  readonly choiceId: Id
  constructor({
    id,
    questionId,
    characterId,
    choiceId,
  }: Omit<UserAnswerProps, 'type'> & { choiceId: Id }) {
    super({ id, questionId, characterId: characterId, type: questionType.QCM })
    this.choiceId = choiceId
  }
}

export class UserAnswerTextHole extends UserAnswer {
  readonly values: string[]
  constructor({
    id,
    questionId,
    characterId,
    values,
  }: Omit<UserAnswerProps, 'type'> & { values: string[] }) {
    super({ id, questionId, characterId: characterId, type: questionType.TEXT_HOLE })
    this.values = values
  }
}
