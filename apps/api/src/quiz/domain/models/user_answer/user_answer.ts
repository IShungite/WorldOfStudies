import { QuestionType } from '#quiz/domain/models/quiz/question'
import { Id } from '#shared/id/domain/models/id'

type UserAnswerProps = {
  id?: Id
  quizInstanceId: Id
  questionId: Id
  characterId: Id
  type: QuestionType
  createdAt: Date
}

type CreateUserAnswerDtoBase = {
  id?: Id
  quizInstanceId: Id
  questionId: Id
  characterId: Id
  type: QuestionType
}

export type CreateUserAnswerDtoQcm = CreateUserAnswerDtoBase & {
  type: QuestionType.QCM
  choiceId: Id
}

export type CreateUserAnswerDtoTextHole = CreateUserAnswerDtoBase & {
  type: QuestionType.TEXT_HOLE
  values: string[]
}

export type CreateUserAnswerDto = CreateUserAnswerDtoQcm | CreateUserAnswerDtoTextHole

export abstract class UserAnswer {
  readonly id: Id
  readonly quizInstanceId: Id
  readonly questionId: Id
  readonly characterId: Id
  readonly type: QuestionType
  readonly createdAt: Date
  protected constructor({
    id,
    quizInstanceId,
    questionId,
    characterId,
    type,
    createdAt,
  }: UserAnswerProps) {
    this.id = id ?? Id.factory()
    this.quizInstanceId = quizInstanceId
    this.questionId = questionId
    this.characterId = characterId
    this.type = type
    this.createdAt = createdAt
  }
}

export class UserAnswerQcm extends UserAnswer {
  readonly choiceId: Id
  constructor({
    id,
    quizInstanceId,
    questionId,
    characterId,
    choiceId,
    createdAt,
  }: Omit<UserAnswerProps, 'type'> & { choiceId: Id }) {
    super({ id, quizInstanceId, questionId, characterId, type: QuestionType.QCM, createdAt })
    this.choiceId = choiceId
  }
}

export class UserAnswerTextHole extends UserAnswer {
  readonly values: string[]
  constructor({
    id,
    quizInstanceId,
    questionId,
    characterId,
    values,
    createdAt,
  }: Omit<UserAnswerProps, 'type'> & { values: string[] }) {
    super({
      id,
      quizInstanceId,
      questionId,
      characterId: characterId,
      type: QuestionType.TEXT_HOLE,
      createdAt,
    })
    this.values = values
  }
}
